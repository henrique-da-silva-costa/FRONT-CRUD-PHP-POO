import React, { useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';

const Cadastrar = ({ inputs = {}, pegarDadosCarregar = () => { } }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [modal, setModal] = useState(false);

    const toggle = () => {
        setErro({})
        setMsg("")
        setFormulario(inputs);
        setModal(!modal)
    };

    const changeInputs = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario, [name]: value
        });
    }

    const enviar = (e) => {
        e.preventDefault();

        const msgerros = {};

        for (const [key, value] of Object.entries(formulario)) {
            if (!value) {
                msgerros[key] = "Campo obrigatório";
                setModal(true);
                setErro(msgerros);
                setMsg("");
                return;
            }
        }

        setErro(msgerros);
        setDesabilitar(true);

        axios.post("http://localhost:1999/cadastrar.php", formulario, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            if (res.data.erro) {
                setMsg(res.data.msg);
                setModal(true);
                setErro({});
                return;
            }

            pegarDadosCarregar();
            setMsg("");
            setErro({});
            setModal(false)
            setDesabilitar(false);
        }).catch((err) => {
            if (err) {
                setModal(true);
            }
            setDesabilitar(false)
            console.log(err);
        })


        console.log(msg);
    }

    return (
        <div>
            <Button color="success" onClick={toggle}>
                CADASTRAR
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>CADASTRAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{valor}</Label>
                                            <Input disabled={desabilitar} name={valor} onChange={changeInputs} />
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </FormGroup>
                        <span className={styles.erro}>{msg}</span>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button color="danger" disabled={desabilitar} onClick={() => setModal(false)}>FECHAR</Button>
                            <Button color="success" disabled={desabilitar}>ENVIAR</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Cadastrar
