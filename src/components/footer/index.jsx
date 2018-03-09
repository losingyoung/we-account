import React from 'react'
import * as Styled from './Styled'
class Footer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    render() {
        console.log(Styled)
        return (
            <Styled.Container>
                <Styled.TabItem>1</Styled.TabItem>
                <Styled.TabItem>2</Styled.TabItem>
                <Styled.PlaceholderButton/>
                <Styled.TabItem>3</Styled.TabItem>
                <Styled.TabItem>4</Styled.TabItem>
                <Styled.AddButton></Styled.AddButton>
            </Styled.Container>
        )

    }
}
export default Footer