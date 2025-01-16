import React, { useState } from 'react'
import { Button, Form, FormGroup, Input, Label } from 'reactstrap'
import styles from "../stylos.module.css"
import axios from 'axios';

const Cadastrar = ({ inputs = {} }) => {
    const [formulario, setFormulario] = useState(inputs);
    const [erro, setErro] = useState({});

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
            console.log(key);

            if (!value) {
                msgerros[key] = "Campo obrigatório";
            }

        }

        console.log(msgerros);

        setErro(msgerros);

        axios.post("http://localhost:1999/cadastrar.php", formulario, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }).then((res) => {
            console.log(res.data)
        }).catch((err) => {
            console.log(err);
        })
    }

    return (
        <div>
            <Form onSubmit={enviar}>
                <h2>Cadastrar</h2>
                <FormGroup>
                    {Object.keys(formulario).map((valor, index) => {
                        return (
                            <div key={index}>
                                <div className="">
                                    <Label htmlFor={valor} className={styles.labels}>{valor}</Label>
                                    <Input name={valor} onChange={changeInputs} />
                                    <p className={styles.erro}>{erro[valor]}</p>
                                </div>
                            </div>
                        )
                    })}
                </FormGroup>
                <Button>ENVIAR</Button>
            </Form>
        </div>
    )
}

export default Cadastrar
