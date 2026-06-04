export default function FormMessage({ texto, ok = false }) {
  const classe = "msg-form" + (ok ? " ok" : texto ? " erro" : "");
  return (
    <p className={classe} role="status">
      {texto}
    </p>
  );
}
