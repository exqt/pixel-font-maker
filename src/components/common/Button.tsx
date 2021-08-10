import styled from 'styled-components'

const Color = "#222";
const HoverColor = "#111";

const Button = styled.button`
  background: ${Color};
  color: white;

  padding: ${(props: {compact?: boolean}) => !props.compact ? "0.6em 1em" : "0.6em" };
  border-radius: 3px;
  border: 2px solid ${Color};
  user-select: none;
  transition: 0.2s linear;

  &:hover {
    background: ${HoverColor};
    border: 2px solid ${HoverColor};
  }

  & > *:not(:last-child) {
    margin-right: 0.5em;
  }
`;

export default Button;
