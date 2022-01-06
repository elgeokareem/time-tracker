export default function Task({ task, time,}: {
  task: string;
  time: string | number;
}) {
  return (
    <div className="flex items-center my-4 w-full px-2 py-1 rounded-full border border-[#dda15e] text-[#fefae0] text-xs gap-5">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 min-w-[24px]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="#606c38"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-lg font-bold">{task}</p>
      <p className="ml-auto text-lg">{time}</p>
    </div>
  );
}
