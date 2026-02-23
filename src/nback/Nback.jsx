import {useCallback, useEffect, useRef, useState} from 'react';
import {useBodyBackground} from '../hooks/useBodyBackground';
import styles from './Nback.module.css';

const ITEMS_COLORS = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'orange', 'grey', 'black'];
const ITEMS_NUMS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

export default function Nback() {
  useBodyBackground('#c1d3e3');

  const [nBack, setNBack] = useState(2);
  const [useNums, setUseNums] = useState(false);
  const [score, setScore] = useState(0);
  const [scoreColor, setScoreColor] = useState('black');
  const [activeCell, setActiveCell] = useState({pos: null, val: null});
  const [counter, setCounter] = useState(null);
  const [isButtonsDisabled, setIsButtonsDisabled] = useState(true);

  const gameState = useRef({
    items: [], positions: [], pickedItem: false, pickedPos: false, timer: null, countdown: null,
  });

  const stopGame = useCallback(() => {
    if (gameState.current.timer) clearInterval(gameState.current.timer);
    if (gameState.current.countdown) clearInterval(gameState.current.countdown);
    setActiveCell({pos: null, val: null});
    setIsButtonsDisabled(true);
  }, []);

  const changeScore = (x) => {
    setScore(prev => prev + x);
    setScoreColor(x > 0 ? 'green' : 'red');
    setTimeout(() => setScoreColor('black'), 500);
  };

  const gameStep = useCallback(() => {
    const {items, positions, pickedItem, pickedPos} = gameState.current;
    const n = items.length;

    if (n >= nBack) {
      const itemMatch = items[n - 1] === items[n - 1 - nBack];
      const posMatch = positions[n - 1] === positions[n - 1 - nBack];

      if ((itemMatch && !pickedItem) || (posMatch && !pickedPos)) {
        changeScore(-1);
      }
    }

    const newPos = Math.floor(Math.random() * 9) + 1;
    const newVal = Math.floor(Math.random() * 9);

    gameState.current.items.push(newVal);
    gameState.current.positions.push(newPos);
    gameState.current.pickedItem = false;
    gameState.current.pickedPos = false;

    setActiveCell({pos: newPos, val: newVal});
    setIsButtonsDisabled(false);

    setTimeout(() => {
      setActiveCell({pos: null, val: null});
    }, 1500);
  }, [nBack]);

  const newGame = useCallback(() => {
    stopGame();
    setScore(0);
    gameState.current.items = [];
    gameState.current.positions = [];

    let count = 3;
    setCounter(count);

    gameState.current.countdown = setInterval(() => {
      --count;
      setCounter(count > 0 ? count : null);
      if (count < 1) {
        clearInterval(gameState.current.countdown);
        gameStep();
        gameState.current.timer = setInterval(gameStep, 3000);
      }
    }, 1000);
  }, [stopGame, gameStep]);

  const handleCheck = (type) => {
    const {items, positions, pickedItem, pickedPos} = gameState.current;
    const n = items.length;

    if (n <= nBack) {
      changeScore(-1);
      return;
    }

    if (type === 'item' && pickedItem) return;
    if (type === 'pos' && pickedPos) return;

    const isMatch = type === 'item' ? items[n - 1] === items[n - 1 - nBack] : positions[n - 1] === positions[n - 1 - nBack];

    if (isMatch) {
      changeScore(1);
      if (type === 'item') gameState.current.pickedItem = true;
      if (type === 'pos') gameState.current.pickedPos = true;
    } else {
      changeScore(-1);
    }
  };

  useEffect(() => {
    newGame();
    return stopGame;
  }, [nBack, useNums, newGame, stopGame]);

  return (<main>
    <table>
      <caption>
        <button type='button' className='left' onClick={newGame}>NEW</button>
        <label htmlFor='nback'>N-back:
          <input
            id='nback'
            type='number'
            value={nBack}
            min='1' max='10'
            onChange={e => setNBack(Math.max(1, Math.min(10, Number(e.target.value))))}
          />
        </label>&nbsp;
        <label htmlFor='numbers'>Numbers:
          <input
            id='numbers'
            type='checkbox'
            checked={useNums}
            onChange={e => setUseNums(e.target.checked)}
          />
        </label>
        <span className='right' style={{color: scoreColor}}>Score: {score}</span>
      </caption>
      <tbody id={styles.field}>
      {[0, 1, 2].map(row => (<tr key={row}>
        {[1, 2, 3].map(col => {
          const id = row * 3 + col;
          const isActive = activeCell.pos === id;
          const backgroundColor = isActive && !useNums ? ITEMS_COLORS[activeCell.val] : 'white';
          return (<td key={id} style={{backgroundColor}}>
            {isActive && useNums ? ITEMS_NUMS[activeCell.val] : ''}
            {id === 5 && counter !== null && <span className={styles.counter}>{counter}</span>}
          </td>);
        })}
      </tr>))}
      </tbody>
    </table>

    <div>
      <button
        className={styles.button}
        disabled={isButtonsDisabled}
        onClick={() => handleCheck('item')}
      >
        ITEM
      </button>
      &nbsp;
      <button
        className={styles.button}
        disabled={isButtonsDisabled}
        onClick={() => handleCheck('pos')}
      >
        POSITION
      </button>
    </div>
  </main>);
}
