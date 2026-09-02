type CodeBoxProps = {
  code: string | number;
};

export default function CodeBox({ code }: CodeBoxProps) {
  const digits = String(code).padStart(4, "0").slice(0, 4).split("");

  return (
    <div className="flex items-center justify-center gap-3">
      {digits.map((digit, index) => (
        <div
          key={index}
          className="flex h-14 w-14 items-center justify-center rounded-xl border border-app bg-surface-elevated text-2xl font-bold text-app shadow-sm"
        >
          {digit}
        </div>
      ))}
    </div>
  );
}