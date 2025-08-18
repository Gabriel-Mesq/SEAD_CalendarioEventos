import React, { useState, useEffect } from "react";
import './Frotas.css';
import Modal from "../components/Modal";
import { apiService } from "../services/api";

interface Veiculo {
  id: number;
  modelo: string;
  placa: string;
  quilometragem: number;
  proxima_manutencao: number;
  ultima_limpeza: string; 
}

const Frotas: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [form, setForm] = useState({
    modelo: "",
    placa: "",
    quilometragem: "",
    proximaManutencao: "",
    ultimaLimpeza: "", 
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    const fetchVeiculos = async () => {
      setLoading(true);
      const res = await apiService.request<Veiculo[]>("/frotas");
      if (res.success && res.data) setVeiculos(res.data);
      setLoading(false);
    };
    fetchVeiculos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const novoVeiculo = {
      modelo: form.modelo,
      placa: form.placa,
      quilometragem: form.quilometragem ? Number(form.quilometragem) : 0,
      proxima_manutencao: form.proximaManutencao ? Number(form.proximaManutencao) : 0,
      ultima_limpeza: form.ultimaLimpeza || new Date().toISOString().slice(0, 10),
    };
    const res = await apiService.request<Veiculo>("/frotas", {
      method: "POST",
      body: JSON.stringify(novoVeiculo),
    });
    if (res.success && res.data) {
      setVeiculos([...veiculos, res.data]);
      setFeedback("Veículo cadastrado com sucesso!");
    } else {
      setFeedback(res.message || "Erro ao cadastrar veículo.");
    }
    setForm({
      modelo: "",
      placa: "",
      quilometragem: "",
      proximaManutencao: "",
      ultimaLimpeza: "",
    });
    setModalOpen(false);
    setLoading(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  const verificarManutencao = (veiculo: Veiculo) => veiculo.quilometragem >= veiculo.proxima_manutencao;
  const verificarLimpeza = (veiculo: Veiculo) => {
    const ultima = new Date(veiculo.ultima_limpeza);
    const hoje = new Date();
    const diff = hoje.getTime() - ultima.getTime();
    return diff > 30 * 24 * 60 * 60 * 1000;
  };

  return (
    <div className="frotas-container">
      <h2>Controle de Frotas</h2>
      <button className="frotas-form button" onClick={() => setModalOpen(true)}>
        <span role="img" aria-label="plus">➕</span> Cadastrar Veículo
      </button>
      {feedback && <div className="frotas-feedback">{feedback}</div>}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Cadastrar Veículo">
        <form className="frotas-form" onSubmit={handleSubmit}>
          <input
            name="modelo"
            placeholder="Modelo"
            value={form.modelo}
            onChange={handleChange}
            required
          />
          <input
            name="placa"
            placeholder="Placa"
            value={form.placa}
            onChange={handleChange}
            required
          />
          <input
            name="quilometragem"
            type="number"
            placeholder="Quilometragem atual"
            value={form.quilometragem}
            onChange={handleChange}
            required
          />
          <input
            name="proximaManutencao"
            type="number"
            placeholder="Km para próxima manutenção"
            value={form.proximaManutencao}
            onChange={handleChange}
            required
          />
          <input
            name="ultimaLimpeza"
            type="date"
            placeholder="Data da última limpeza"
            value={form.ultimaLimpeza}
            onChange={handleChange}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Salvando..." : "Salvar"}
          </button>
        </form>
      </Modal>

      <h3>Veículos cadastrados</h3>
      {loading ? (
        <div className="frotas-loading">Carregando...</div>
      ) : (
        <table className="frotas-table">
          <thead>
            <tr>
              <th>Modelo</th>
              <th>Placa</th>
              <th>Quilometragem</th>
              <th>Próxima Manutenção (Km)</th>
              <th>Limpeza Mensal</th>
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <tr key={v.id}>
                <td>{v.modelo}</td>
                <td>{v.placa}</td>
                <td>{v.quilometragem.toLocaleString()}</td>
                <td>
                  {verificarManutencao(v) ? (
                    <span className="frotas-alert manutencao">
                      <span role="img" aria-label="alert">⚠️</span> Manutenção pendente!
                    </span>
                  ) : (
                    v.proxima_manutencao.toLocaleString()
                  )}
                </td>
                <td>
                  {verificarLimpeza(v) ? (
                    <span className="frotas-alert limpeza">
                      <span role="img" aria-label="alert">🧹</span> Limpeza pendente!
                    </span>
                  ) : (
                    new Date(v.ultima_limpeza).toLocaleDateString()
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Frotas;