import React from "react"
import Cadastrar from "./crud/Cadastrar"
import { Container } from "reactstrap"

const Home = () => {

    const inputs = {
        nome: "",
        idade: ""
    }

    return (
        <Container>
            <Cadastrar inputs={inputs} />
        </Container>

    )

}

export default Home