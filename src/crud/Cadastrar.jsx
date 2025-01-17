import React, { useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';

const Cadastrar = ({ inputs = {}, pegarDadosCarregar = () => { } }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [desabilitar, setDesabilitar] = useState(false);
    const [textoBotaoCarregando, setTextoBotaoCarregando] = useState("CADASTRAR");
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

        setErro(msgerros);
        setDesabilitar(true);
        setTextoBotaoCarregando("CAREGANDO...")

        axios.post("http://localhost:1999/cadastrar.php", formulario, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            for (const [key, value] of Object.entries(formulario)) {
                if (value.length == 0) {
                    msgerros[key] = "Campo obrigatório";
                }

                if (value.length > 10 && key == "idade") {
                    msgerros[key] = `O campo ${key} dever ter no maximo 10 caracteres`;
                }

                if (value.length > 255) {
                    msgerros[key] = `O campo ${key} dever ter no maximo 255 caracteres`;
                }

                setErro(msgerros);

                if (res.data.erro) {
                    setModal(true);
                    setMsg(res.data.msg);
                    setDesabilitar(false);
                    setTextoBotaoCarregando("CADASTRAR")
                }

                setErro(msgerros);
            }

            if (!res.data.erro) {
                pegarDadosCarregar();
                setMsg("");
                setModal(false)
                setDesabilitar(false);
                setTextoBotaoCarregando("CADASTRAR")
            }
        }).catch((err) => {
            if (err) {
                setModal(true);
            }
            setDesabilitar(false)
            setTextoBotaoCarregando("CADASTRAR")
            setMsg("Erro interno no servidor. Por favor contate o suporte");
        })
    }

    const tipoPlaceholder = (tipo) => {

        if (tipo == "nome") {
            return "Informe o nome";
        }

        if (tipo == "idade") {
            return "Informe a Idade";
        }
    }

    return (
        <div>
            <Button color="success" onClick={toggle}>
                CADASTRAR
            </Button>
            <Modal backdrop={modal ? "static" : true} isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>CADASTRAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{valor}</Label>
                                            <Input placeholder={tipoPlaceholder(valor)} disabled={desabilitar} name={valor} onChange={changeInputs} />
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </FormGroup>
                        <span className={styles.erro}>{msg}</span>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button color="danger" disabled={desabilitar} onClick={() => setModal(false)}>FECHAR</Button>
                            <Button color="success" disabled={desabilitar}>{textoBotaoCarregando}</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Cadastrar
