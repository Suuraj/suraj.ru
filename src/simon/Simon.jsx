import {useState, useEffect, useRef, useCallback} from 'react';
import {useBodyBackground} from '../hooks/useBodyBackground';
import styles from './Simon.module.css';

const COLORS = [
  {id: 0, normal: '#f45325', active: '#f78b6e'},
  {id: 1, normal: '#81bd06', active: '#97df07'},
  {id: 2, normal: '#05a5ef', active: '#69cdfc'},
  {id: 3, normal: '#ffba07', active: '#ffd466'}];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export default function Simon() {
  useBodyBackground('#c1d3e3');

  const [level, setLevel] = useState(0);
  const [litCell, setLitCell] = useState(null);
  const [isClickable, setIsClickable] = useState(false);
  const [isStartDisabled, setIsStartDisabled] = useState(true);

  const sequence = useRef([]);
  const userStep = useRef(0);

  const flash = async (id) => {
    setLitCell(id);
    await sleep(500);
    setLitCell(null);
  };

  const playSequence = useCallback(async () => {
    setIsClickable(false);
    await sleep(500);

    const newColor = Math.floor(Math.random() * 4);
    sequence.current.push(newColor);
    setLevel(sequence.current.length);

    for (const colorId of sequence.current) {
      await sleep(500);
      await flash(colorId);
    }

    userStep.current = 0;
    setIsClickable(true);
  }, []);

  const handleClick = async (id) => {
    if (!isClickable) return;

    if (id !== sequence.current[userStep.current]) {
      setIsClickable(false);
      alert(`GAME OVER! Score: ${level - 1}`);
      sequence.current = [];
      setLevel(0);
      return;
    }

    userStep.current++;
    const isRoundOver = userStep.current === sequence.current.length;

    if (isRoundOver) setIsClickable(false);

    await flash(id);

    if (isRoundOver) {
      await sleep(1000);
      playSequence();
    }
  };

  useEffect(() => {
    const intro = async () => {
      for (const id of [0, 1, 3, 2]) {
        await flash(id);
        await sleep(100);
      }
      setIsStartDisabled(false);
    };
    intro();
  }, []);

  return (<main>
    <table>
      <caption>
        <button type='button' className='left' onClick={() => {
          sequence.current = [];
          playSequence();
        }} disabled={isStartDisabled}>
          NEW
        </button>
        <label className='right'>Level: {level}</label>
      </caption>
      <tbody>
      <tr>
        <Cell id={0} activeId={litCell} onClick={handleClick}/>
        <Cell id={1} activeId={litCell} onClick={handleClick}/>
      </tr>
      <tr>
        <Cell id={2} activeId={litCell} onClick={handleClick}/>
        <Cell id={3} activeId={litCell} onClick={handleClick}/>
      </tr>
      </tbody>
    </table>
  </main>);
}

function Cell({id, activeId, onClick}) {
  const colorConfig = COLORS[id];
  return (<td className={styles}
    onClick={() => onClick(id)}
    style={{
      backgroundColor: activeId === id ? colorConfig.active : colorConfig.normal, cursor: 'pointer',
    }}
  />);
}
