import "./App.css";
import PodcastPlayer from "./features/podcast-player/PodcastPlayer";

function App() {
  
  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <PodcastPlayer
        audioUrl={"./EP1.mp3"}
        thumbnailUrl={'./Thumbnail.jpg'}
      />
    </div>
  );
}

export default App;
