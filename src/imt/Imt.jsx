import {useState} from 'react';
import {useBodyBackground} from '../hooks/useBodyBackground';
import styles from './Imt.module.css';

const shuffle = (array) => {
  const indices = [...array];
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  return indices;
};

const generateCells = (qty) => {
  const indices = Array.from({length: 60}, (_, i) => i + 1);
  const shuffledIndices = shuffle(indices);
  const valuesMap = {};
  for (let i = 0; i < qty; i++) {
    valuesMap[shuffledIndices[i]] = i + 1;
  }
  return indices.map(id => ({
    id, value: valuesMap[id] || null, isHidden: false, isWrong: false,
  }));
};

export default function Imt() {
  const [qty, setQty] = useState(5);
  const [cells, setCells] = useState(() => generateCells(5));
  const [isHidingDisabled, setIsHidingDisabled] = useState(false);

  useBodyBackground('#c1d3e3');

  const newGame = (currentQty = qty) => {
    setCells(generateCells(currentQty));
    setIsHidingDisabled(false);
  };

  const handleQtyChange = (e) => {
    const n = Math.min(60, Math.max(1, Number(e.target.value)));
    setQty(n);
    newGame(n);
  };

  const handleHide = () => {
    setIsHidingDisabled(true);
    setCells(prev => prev.map(cell => ({...cell, isHidden: !!cell.value})));
  };

  const handleClick = (clickedCell) => {
    if (!clickedCell.isHidden) return;

    const hiddenValues = cells
      .filter(cell => cell.isHidden && cell.value !== null)
      .map(cell => cell.value);

    const nextCorrectValue = Math.min(...hiddenValues);

    const isCorrect = clickedCell.value === nextCorrectValue;

    setCells(prev => prev.map(cell => cell.id === clickedCell.id ? {
      ...cell, isHidden: false, isWrong: !isCorrect,
    } : cell));
  };

  return (<main>
    <table>
      <caption>
        <button type='button' className='left' onClick={() => newGame()}>NEW</button>
        <label htmlFor='qty'>Qty:</label>
        <input
          id='qty'
          type='number'
          min='1' max='60'
          value={qty}
          onChange={handleQtyChange}
        />
        <button
          type='button'
          className='right'
          onClick={handleHide}
          disabled={isHidingDisabled}
        >
          HIDE
        </button>
      </caption>
      <tbody id={styles.imt}>
      {[0, 1, 2, 3, 4, 5].map(rowIndex => (<tr key={rowIndex}>
        {cells.slice(rowIndex * 10, rowIndex * 10 + 10).map(cell => (<td
          key={cell.id}
          onClick={() => cell.value && handleClick(cell)}
          className={cell.value && `${cell.isHidden ? styles.hidden : ''} ${cell.isWrong ? styles.wrong : ''}`.trim()}
        >
          {cell.value}
        </td>))}
      </tr>))}
      </tbody>
    </table>
  </main>);
}
