import React, { useState } from "react";
import './Frotas.css';
import Modal from "../components/Modal";

interface Veiculo {
  id: number;
  modelo: string;
  placa: string;
  kilometragem: number;
  proximaManutencao: number;
  ultimaLimpeza: string;
}

const Frotas: React.FC = () => {
  const [veiculos, setVeiculos] = useState<Veiculo[]>([]);
  const [form, setForm] = useState({
    modelo: "",
    placa: "",
    kilometragem: "",
    proximaManutencao: "",
  });
  const [modalOpen, setModalOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVeiculos([
      ...veiculos,
      {
        id: Date.now(),
        modelo: form.modelo,
        placa: form.placa,
        kilometragem: Number(form.kilometragem),
        proximaManutencao: Number(form.proximaManutencao),
        ultimaLimpeza: new Date().toISOString().slice(0, 10),
      },
    ]);
    setForm({
      modelo: "",
      placa: "",
      kilometragem: "",
      proximaManutencao: "",
    });
    setModalOpen(false);
  };

  const verificarManutencao = (veiculo: Veiculo) => {
    return veiculo.kilometragem >= veiculo.proximaManutencao;
  };

  const verificarLimpeza = (veiculo: Veiculo) => {
    const ultima = new Date(veiculo.ultimaLimpeza);
    const hoje = new Date();
    const diff = hoje.getTime() - ultima.getTime();
    return diff > 30 * 24 * 60 * 60 * 1000; // 30 dias
  };

  return (
    <>
      <h2>Controle de Frotas</h2>
      <button className="frotas-form button" onClick={() => setModalOpen(true)}>
        Cadastrar Veículo
      </button>
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
            name="kilometragem"
            type="number"
            placeholder="Kilometragem atual"
            value={form.kilometragem}
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
          <button type="submit">Salvar</button>
        </form>
      </Modal>

      <h3>Veículos cadastrados</h3>
      <table className="frotas-table">
        <thead>
          <tr>
            <th>Modelo</th>
            <th>Placa</th>
            <th>Kilometragem</th>
            <th>Próxima Manutenção (Km)</th>
            <th>Limpeza Mensal</th>
          </tr>
        </thead>
        <tbody>
          {veiculos.map((v) => (
            <tr key={v.id}>
              <td>{v.modelo}</td>
              <td>{v.placa}</td>
              <td>{v.kilometragem}</td>
              <td>
                {verificarManutencao(v) ? (
                  <span className="frotas-alert manutencao">Manutenção pendente!</span>
                ) : (
                  v.proximaManutencao
                )}
              </td>
              <td>
                {verificarLimpeza(v) ? (
                  <span className="frotas-alert limpeza">Limpeza pendente!</span>
                ) : (
                  v.ultimaLimpeza
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Frotas;