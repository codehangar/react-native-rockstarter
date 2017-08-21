import React from 'react';
import { StyleSheet, ListView } from 'react-native';
import {
    Container,
    Header,
    Content,
    Spinner,
    List,
    ListItem,
    Button,
    Body,
    Text,
    Right,
    Icon,
    Form,
    Item,
    Input,
    Label
} from 'native-base';

export default class StarWars extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: `Star Wars ${navigation.state.params.endpoint}`,
        headerBackTitle: null
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        return this.getData(`https://swapi.co/api/${this.props.navigation.state.params.endpoint}`);
    }

    getData = (url) => {
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson.results', responseJson.results); // eslint-disable-line no-console
                this.setState({
                    isLoading: false,
                    dataSource: responseJson.results,
                    next: responseJson.next
                });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    render() {
        if (this.state.isLoading) {
            return (
                <Container>
                    <Content contentContainerStyle={styles.container}>
                        <Spinner/>
                    </Content>
                </Container>
            );
        }

        const { navigate } = this.props.navigation;
        return (
            <Container>
                <Content>
                    <List
                        dataArray={this.state.dataSource}
                        renderRow={(rowData) => (
                            <ListItem onPress={() => navigate('Person', { dataUrl: rowData.url })}>
                                <Body><Text>{rowData.name}</Text></Body>
                                <Right><Icon name="arrow-forward"/></Right>
                            </ListItem>
                        )}
                    />
                </Content>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
});
