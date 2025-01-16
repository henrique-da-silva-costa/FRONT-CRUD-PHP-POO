import React, { useEffect, useState } from "react"
import Cadastrar from "./crud/Cadastrar"
import { Container, Table } from "reactstrap"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import Editar from "./crud/Editar"
import Excluir from "./crud/Excluir"
import Carregando from "./Carregando"

const Home = () => {
    const [dados, setDados] = useState([]);
    const [removerLoading, setRemoverLoading] = useState(false);
    const nav = useNavigate();

    const inputs = {
        nome: "",
        idade: ""
    }

    const pegarDados = () => {
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

    useEffect(() => {
        setTimeout(() => {
            pegarDados();
        }, 1000);
    }, []);

    return (
        <>
            <Container className="mt-2">
                <h1>Pessoa</h1>
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
                                                {dado.nome}
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