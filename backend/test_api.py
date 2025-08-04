import requests
import json

# Configuração
BASE_URL = "http://localhost:8000/api"

def test_health():
    """Testa o endpoint de saúde"""
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erro no health check: {e}")
        return False

def test_submit_form():
    """Testa a submissão de formulário"""
    data = {
        "nome_unidade": "Unidade de Teste",
        "eventos": [
            {
                "nome": "Evento de Teste 1",
                "unidade_responsavel": "Unidade de Teste",
                "quantidade_pessoas": 50,
                "mes_previsto": "Janeiro",
                "coffee_break_manha": True,
                "coffee_break_tarde": False,
                "almoco": True,
                "jantar": False,
                "cerimonial": False
            },
            {
                "nome": "Evento de Teste 2",
                "unidade_responsavel": "Unidade de Teste",
                "quantidade_pessoas": 100,
                "mes_previsto": "Fevereiro",
                "coffee_break_manha": True,
                "coffee_break_tarde": True,
                "almoco": True,
                "jantar": True,
                "cerimonial": True
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/eventos",
            json=data,
            headers={"Content-Type": "application/json"}
        )
        print(f"Submit Form: {response.status_code}")
        print(f"Response: {response.json()}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erro na submissão: {e}")
        return False

def test_get_events():
    """Testa a listagem de eventos"""
    try:
        response = requests.get(f"{BASE_URL}/eventos")
        print(f"Get Events: {response.status_code}")
        events = response.json()
        print(f"Total eventos: {len(events) if isinstance(events, list) else 'N/A'}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erro ao listar eventos: {e}")
        return False

def test_get_unidades():
    """Testa a listagem de unidades"""
    try:
        response = requests.get(f"{BASE_URL}/unidades")
        print(f"Get Unidades: {response.status_code}")
        unidades = response.json()
        print(f"Total unidades: {len(unidades) if isinstance(unidades, list) else 'N/A'}")
        return response.status_code == 200
    except Exception as e:
        print(f"Erro ao listar unidades: {e}")
        return False

if __name__ == "__main__":
    print("🧪 Testando API do SEAD...")
    print("=" * 50)
    
    tests = [
        ("Health Check", test_health),
        ("Submit Form", test_submit_form),
        ("Get Events", test_get_events),
        ("Get Unidades", test_get_unidades),
    ]
    
    results = []
    for test_name, test_func in tests:
        print(f"\n📋 {test_name}:")
        print("-" * 30)
        success = test_func()
        results.append((test_name, success))
        print()
    
    print("=" * 50)
    print("📊 Resultados:")
    for test_name, success in results:
        status = "✅ PASSOU" if success else "❌ FALHOU"
        print(f"{test_name}: {status}")
    
    passed = sum(1 for _, success in results if success)
    total = len(results)
    print(f"\nTotal: {passed}/{total} testes passaram")
