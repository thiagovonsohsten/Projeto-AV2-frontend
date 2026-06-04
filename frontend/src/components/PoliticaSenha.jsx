import { textoCaracteresPermitidos, textoCaracteresProibidos } from "../utils/validacoes";

export default function PoliticaSenha() {
  return (
    <div className="instrucoes-senha">
      <strong>Política de senha:</strong> mínimo de 6 caracteres; um algarismo; uma letra maiúscula; um caractere
      especial permitido: {textoCaracteresPermitidos}. <strong>Não use:</strong> {textoCaracteresProibidos}.
    </div>
  );
}
