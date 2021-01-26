import SignUp from "../components/SignUp";
import SignIn from "../components/SignIn";
import styled from "styled-components";

const SignUpPage = props => (
   <Column>
       <SignUp />
       <SignIn />
   </Column>
)

const Column = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

export default SignUpPage