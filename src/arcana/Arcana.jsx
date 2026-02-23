import {useMemo, useState} from 'react';
import {useBodyBackground} from '../hooks/useBodyBackground';
import styles from './Arcana.module.css';

const ARCANA_NAMES = {
  1: 'I Маг',
  2: 'II Жрица',
  3: 'III Императрица',
  4: 'IV Император',
  5: 'V Иерофант',
  6: 'VI Влюблённые',
  7: 'VII Колесница',
  8: 'VIII Сила',
  9: 'IX Отшельник',
  10: 'X Колесо Фортуны',
  11: 'XI Справедливость',
  12: 'XII Повешенный',
  13: 'XIII Смерть',
  14: 'XIV Умеренность',
  15: 'XV Дьявол',
  16: 'XVI Башня',
  17: 'XVII Звезда',
  18: 'XVIII Луна',
  19: 'XIX Солнце',
  20: 'XX Суд',
  21: 'XXI Мир',
  22: 'XXII Шут',
};

const collapse = (n) => {
  let num = String(n);
  while (Number(num) > 22) {
    num = String([...num].reduce((acc, digit) => acc + Number(digit), 0));
  }
  return Number(num);
};

export default function Arcana() {
  useBodyBackground('#c1d3e3');
  const [date, setDate] = useState('');
  const results = useMemo(() => {
    if (!date) return null;

    const [y, m, d] = date.split('-');

    const year = collapse(y);
    const month = Number(m);
    const day = collapse(d);

    const fourth = collapse(year + month + day);
    const fifth = collapse(year + month + day + fourth);

    return {day, month, year, fourth, fifth};
  }, [date]);

  return (<main>
    <input
      type='date'
      max='9999-12-31'
      value={date}
      onChange={(e) => setDate(e.target.value)}
      className={styles.date}
    />

    <br/><br/>

    <div className={styles.arcana}>
      <>
        <p title='birth day'>1) {ARCANA_NAMES[results?.day]}</p>
        <p title='month'>2) {ARCANA_NAMES[results?.month]}</p>
        <p title='year'>3) {ARCANA_NAMES[results?.year]}</p>
        <p title='1 + 2 + 3'>4) {ARCANA_NAMES[results?.fourth]}</p>
        <p title='... + 4'>5) {ARCANA_NAMES[results?.fifth]}</p>
      </>
    </div>
  </main>);
}
