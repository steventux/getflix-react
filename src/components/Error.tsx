interface ErrorProps {
  message: string;
}
export default function Error({message}: ErrorProps) {
  return (
    <div className="text-red-600 font-bold flex flex-col items-center">{message}</div>
  );
}
