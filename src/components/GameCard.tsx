import React from "react";
import { useNavigate } from "react-router-dom";
import type { Game } from "../lib/supabase";
import Tag from "./Tag";

interface GameCardProps {
  game: Game;
}

const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const navigate = useNavigate();

  return (
    <div className="game-card" onClick={() => navigate(`/game/${game.id}`)}>
      {game.cover_url ? (
        <img
          src={game.cover_url}
          alt={game.name}
          className="game-card-cover"
          loading="lazy"
        />
      ) : (
        <div className="game-card-cover-placeholder">🎮</div>
      )}
      <div className="game-card-body">
        <div className="game-card-name">{game.name}</div>
        <div className="game-card-tags">
          <Tag label={game.platform} variant="platform" />
          {game.genres.slice(0, 1).map((g) => (
            <Tag key={g} label={g} variant="genre" />
          ))}
          <Tag label={game.file_size} variant="size" />
        </div>
      </div>
    </div>
  );
};

export default GameCard;
