import { Question, Result } from "./components";
import { useGame } from "./contexts";

function App() {
  const { status } = useGame();

  return (
    <div className="app">
      {status === "playing" ? <Question /> : <Result />}
    </div>
  );
}

export default App;
