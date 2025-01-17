import React, { useEffect, useRef, useState } from "react"
import Cadastrar from "./crud/Cadastrar"
import { Button, Container, Input, InputGroup, Label, Table } from "reactstrap"
import axios from "axios"
import Editar from "./crud/Editar"
import Excluir from "./crud/Excluir"
import Carregando from "./Carregando"

const Home = () => {
    const [dados, setDados] = useState([]);
    const [removerLoading, setRemoverLoading] = useState(false);
    const [pesquisar, setPesquisar] = useState("");

    const formRef = useRef();

    const inputs = {
        nome: "",
        idade: ""
    }

    const limparFiltro = () => {
        formRef.current.reset();
        setPesquisar("");
        axios.get("http://localhost:1999", { params: { nome: "" } }).then((res) => {
            setDados(res.data);
            setRemoverLoading(true);
        }).catch((err) => {
            if (err) {
                alert("Erro interno no servidor");
            }

            alert("Erro interno no servidor");
        });
    }

    const pegarDadosCarregar = (e) => {
        e.preventDefault();
        pegarDados();
    }

    const pegarDados = () => {
        axios.get("http://localhost:1999", { params: { nome: pesquisar } }).then((res) => {
            setDados(res.data);
            setRemoverLoading(true);
        }).catch((err) => {
            if (err) {
                alert("Erro interno no servidor");
            }

            alert("Erro interno no servidor");
        });
    }

    useEffect(() => {
        setTimeout(() => {
            pegarDados();
        }, 1000);
    }, []);

    return (
        <>
            <Container className="mt-2">
                <h1>Pessoa</h1>
                <form ref={formRef} onSubmit={pegarDadosCarregar}>
                    <Label><strong>Nome</strong></Label>
                    <InputGroup className="w-50">
                        <Input placeholder="filtrar por nome" onChange={(e) => setPesquisar(e.target.value)} />
                        <Button color="primary">FILTRAR</Button>
                    </InputGroup>
                </form>
                <Button color="secondary" className="mt-2" onClick={limparFiltro}>LIMPAR</Button>
                <div className="text-end">
                    <Cadastrar pegarDadosCarregar={pegarDados} inputs={inputs} />
                </div>
                {
                    dados.length > 0 ? <Table responsive striped>
                        <thead>
                            <tr>
                                <th>
                                    Nome
                                </th>
                                <th>
                                    Idade
                                </th>
                                <th>

                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <>
                                {dados.length > 0 ? dados.map((dado, index) => {
                                    return (
                                        <tr key={index}>
                                            <td>
                                                {dado.nome.length > 20 ? dado.nome.slice(0, 20) + "..." : dado.nome}
                                            </td>
                                            <td>
                                                {dado.idade}
                                            </td>
                                            <td className="d-flex justify-content-end gap-2">
                                                <Editar inputs={inputs} pegarDadosCarregar={pegarDados} id={dado.id} />
                                                <Excluir id={dado.id} pegarDadosCarregar={pegarDados} nome={dado.nome} />
                                            </td>
                                        </tr>
                                    )
                                }) : ""}
                            </>
                        </tbody>
                    </Table> : ""
                }
                {!removerLoading ? <Carregando /> : dados.length > 0 ? "" : <h2 className="text-center">SEM INFORMAÇÕES</h2>}
            </Container>
        </>
    )

}

export default Home