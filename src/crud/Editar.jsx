import React, { useEffect, useState } from 'react'
import { Button, FormGroup, Input, Label, Modal, ModalHeader, ModalBody } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';

const Editar = ({ inputs = {}, pegarDadosCarregar = () => { }, id = null }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});
    const [msg, setMsg] = useState("");
    const [modal, setModal] = useState(false);

    const pegarDados = () => {
        setModal(!modal)

        axios.get("http://localhost:1999/pegarporid.php", { params: { nome: "", id: id } }).then((res) => {

            let ordenado = {
                nome: res.data.nome,
                idade: res.data.idade,
                id: res.data.id,
            }

            setFormulario(ordenado);
        }).catch((err) => {
            alert("Erro interno no servidor");
        });
    }

    const toggle = () => {
        setMsg("")
        setErro({})
        setModal(!modal);
    }

    const changeInputs = (e) => {
        const { name, value } = e.target;

        setFormulario({
            ...formulario, [name]: value
        });

        console.log(formulario);
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
        axios.post("http://localhost:1999/editar.php", formulario, {
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
            setModal(false);
        }).catch((err) => {
            console.log(err);
        })


    }

    const tipoInput = (tipo) => {

        if (tipo == "id") {
            return "hidden";
        }

    }

    const tipoLabel = (tipo) => {

        if (tipo == "id") {
            return "";
        }

    }

    return (
        <div>
            <Button color="primary" onClick={pegarDados}>
                EDITAR
            </Button>
            <Modal isOpen={modal} toggle={toggle}>
                <ModalHeader toggle={toggle}>EDITAR</ModalHeader>
                <ModalBody>
                    <form onSubmit={enviar}>
                        <FormGroup>
                            {formulario ? Object.keys(formulario).map((valor, index) => {
                                return (
                                    <div key={index}>
                                        <div className="">
                                            <Label htmlFor={valor} className={styles.labels}>{tipoLabel(valor)}</Label>
                                            <Input name={valor} value={formulario[valor]} type={tipoInput(valor)} defaultValue={formulario[valor]} onChange={changeInputs} />
                                            <p className={styles.erro}>{erro[valor]}</p>
                                        </div>
                                    </div>
                                )
                            }) : ""}
                        </FormGroup>
                        <span className={styles.erro}>{msg}</span>
                        <div className="d-flex gap-2 justify-content-end">
                            <Button color="danger" onClick={() => setModal(false)}>FECHAR</Button>
                            <Button color="success">ENVIAR</Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </div>
    )
}

export default Editar
