'use client';

import React, { useState } from 'react';
import MineFieldGame from '@/app/games/minefield/MineFieldGame';
import { GameObject } from '@/app/types';

export default function GameManager({
    sessionId,
    gameObject,
  }: {
    sessionId: string,
    gameObject: GameObject
  }) {
    const [currentGame, setCurrentGame] = useState<number>(1);

    const renderGameComponent = ({
        sessionId,
      }: {
        sessionId: string;
      }) => {
        switch (currentGame) {
            case 1:
                return <MineFieldGame sessionId={sessionId} title={gameObject.title} minefield={gameObject.game} />
            default:
                return null;
        }
    };

    return (
        <div>
            <h1>Game Manager</h1>
            <button onClick={() => setCurrentGame(1)}>Game 1</button>
            <button onClick={() => setCurrentGame(2)}>Game 2</button>
            <button onClick={() => setCurrentGame(3)}>Game 3</button>
            {renderGameComponent({ sessionId })}
        </div>
    );
};