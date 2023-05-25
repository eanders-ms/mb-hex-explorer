import styled from "@emotion/styled";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Container = styled.div`
    width: 100%;
    height: 100vh;
    background-color: #f1f5f9;
    display: flex;
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
`;

const TitleBox = styled.div`
    text-align: center;
    padding: 1em 0;
    font-size: 2em;
`;

export default function Render() {
    return (
        <Container>
            <TitleBox>Loading Hex</TitleBox>
            <FontAwesomeIcon icon={faCircleNotch} className='fa-spin' />
        </Container>
    );
}
