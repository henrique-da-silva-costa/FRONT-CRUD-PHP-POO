import axios from 'axios';
import React, { useState } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import styles from "../stylos.module.css"

const Excluir = ({ id = null, nome = "", pegarDadosCarregar = () => { } }) => {
    const [modal, setModal] = useState(false);
    const [msg, setMsg] = useState("");

    const toggle = () => setModal(!modal);

    const excluir = () => {
        axios.delete("http://localhost:1999/excluir.php", { params: { id: id } }).then((res) => {

            if (res.data.erro) {
                setModal(true);
                setMsg(res.data.msg);
                return;
            }

            setModal(false)
            pegarDadosCarregar();
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <Button color="danger" onClick={toggle}>
                EXCLUIR
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EXCLUIR</ModalHeader>
                <ModalBody>
                    <h4>Deseja exluir {nome}</h4>
                    <p className={styles.erro}>{msg}</p>
                </ModalBody>
                <ModalFooter>
                    <Button color="secondary" onClick={() => setModal(false)}>
                        CANCELAR
                    </Button>
                    <Button color="danger" onClick={excluir}>
                        EXCLUIR
                    </Button>{' '}
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default Excluir
