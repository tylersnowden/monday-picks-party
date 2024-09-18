export default function Footer() {
  return (
    <div className="text-white flex flex-col items-center space-y-2">
      <div className="font-medium">Built with PartyKit and Next.js</div>
      <div>
        <a
          className="underline"
          href="https://github.com/tylersnowden/monday-picks-party"
          target="_blank"
        >
          View the Source on Github
        </a>
      </div>
      <div>
        <a
          className="underline"
          href="https://mondaypicks.com"
          target="_blank"
        >
          MondayPicks
        </a>
      </div>
    </div>
  );
}
