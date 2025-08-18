// Configuração da API
const API_BASE_URL = import.meta.env.PROD 
  ? 'https://api.sead.allsafeassessoria.com/api' 
  : 'http://localhost:8000/api';

const RETRY_ENABLED = true;

export interface ApiEventData {
  nome: string;
  unidade_responsavel: string;
  quantidade_pessoas: number;
  mes_previsto: string;
  coffee_break_manha: boolean;
  coffee_break_tarde: boolean;
  almoco: boolean;
  jantar: boolean;
  cerimonial: boolean;
  nome_solicitante: string; // Novo campo
}

export interface ApiFormData {
  nome_unidade: string;
  nome_solicitante: string; // Novo campo
  eventos: ApiEventData[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, string[]>;
}

class ApiService {
  async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const maxTimeMs = 60000; // 1 minuto
    const intervalMs = 2000; // 2 segundos entre tentativas
    const startTime = Date.now();

    while (RETRY_ENABLED && Date.now() - startTime < maxTimeMs) {
      try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          ...options,
        });

        const data = await response.json();

        if (!response.ok) {
          return {
            success: false,
            message: data.detail || 'Erro na requisição',
            errors: data.errors,
          };
        }

        return {
          success: true,
          data,
        };
      } catch (error) {
        // Aguarda antes de tentar novamente
        await new Promise(res => setTimeout(res, intervalMs));
      }
    }

    // Se não conseguir após 1 minuto ou se RETRY_ENABLED for false
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.detail || 'Erro na requisição',
          errors: data.errors,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        message: 'Erro de conexão com o servidor. Tente fazer o envio por outro navegador ou verifique sua internet.',
      };
    }
  }

  async submitForm(formData: ApiFormData): Promise<ApiResponse<any>> {
    return this.request('/eventos', {
      method: 'POST',
      body: JSON.stringify(formData),
    });
  }

  async getEvents(): Promise<ApiResponse<ApiEventData[]>> {
    return this.request('/eventos');
  }

  async getEventById(id: string): Promise<ApiResponse<ApiEventData>> {
    return this.request(`/eventos/${id}`);
  }

  // Método para testar conexão com o backend
  async healthCheck(): Promise<ApiResponse<{ status: string }>> {
    return this.request('/health');
  }
}

export const apiService = new ApiService();
