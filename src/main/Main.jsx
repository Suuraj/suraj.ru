import {useState} from 'react';
import {NavLink} from 'react-router-dom';
import {useBodyBackground} from '../hooks/useBodyBackground';
import styles from './Main.module.css';

export default function Main() {
  const [isHidden, setIsHidden] = useState(true);

  useBodyBackground('white');

  const toggleMemoryGames = (e) => {
    e.preventDefault();
    setIsHidden(!isHidden);
  };

  return (<main id={styles.main}>
    <div>
      <a href='https://www.thght.ru/' target='_blank' rel='noopener noreferrer'>
        мой блог
      </a>
    </div>

    <div>
      <a href='https://arith.ru/' target='_blank' rel='noopener noreferrer'>
        упражнение для ума
      </a>
    </div>

    <div onClick={toggleMemoryGames}>
      <a href=''>упражнения для памяти</a>
    </div>

    <div className={isHidden ? styles.hidden : null}>
      <NavLink to='/imt'>матрица памяти</NavLink>&nbsp;
      <NavLink to='/nback'>задача n-назад</NavLink><br/><br/>
      <NavLink to='/simon'>саймон</NavLink>
    </div>

    <div>
      <a href='/eye-test'>eye test</a>
    </div>
  </main>);
}
