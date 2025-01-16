import React from 'react';
import img from "./loading.svg";
import styles from "./stylos.module.css";

const Carregando = () => {
    return (
        <div className={styles.loading}>
            <img src={img} height={100} alt="Carregando" />
        </div>
    )
}

export default Carregando
