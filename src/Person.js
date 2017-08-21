import React from 'react';
import { StyleSheet, Image, Dimensions } from 'react-native';
import {
    Container,
    Header,
    Content,
    Spinner,
    List,
    ListItem,
    Button,
    H1,
    Card,
    CardItem,
    Body,
    Left,
    Thumbnail,
    Text,
    Right,
    Icon,
    Form,
    Item,
    Input,
    Label
} from 'native-base';

const deviceWidth = Dimensions.get('window').width;

export default class Person extends React.Component {
    static navigationOptions = ({ navigation, screenProps }) => ({
        title: `Detail`,
        headerBackTitle: null
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        console.log('this.props.navigation.state.params.dataUrl', this.props.navigation.state.params.dataUrl); // eslint-disable-line no-console
        return this.getData(this.props.navigation.state.params.dataUrl);
    }

    getData = (url) => {
        fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log('responseJson', responseJson); // eslint-disable-line no-console
                this.setState({
                    isLoading: false,
                    dataSource: responseJson
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

        return (
            <Container>
                <Content padder>
                    <Card style={{ flex: 0 }}>
                        <CardItem bordered>
                            <Left>
                                <Thumbnail
                                    source={{ uri: 'http://screenrant.com/wp-content/uploads/luke-skywalker-star-wars-a-new-hope.jpg' }}/>
                                <Body>
                                <Text>{this.state.dataSource.name}</Text>
                                <Text note>Born {this.state.dataSource.birth_year}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                            <Image
                                resizeMode="cover"
                                source={{ uri: 'http://screenrant.com/wp-content/uploads/luke-skywalker-star-wars-a-new-hope.jpg' }}
                                style={{
                                    alignSelf: 'center',
                                    height: 150,
                                    resizeMode: 'cover',
                                    width: deviceWidth / 1.18,
                                    marginVertical: 5
                                }}
                            />
                            <Text>
                                <Text style={styles.bold}>Gender: </Text>
                                <Text>{this.state.dataSource.gender}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Height: </Text>
                                <Text>{this.state.dataSource.height}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Mass: </Text>
                                <Text>{this.state.dataSource.mass}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Skin Color: </Text>
                                <Text>{this.state.dataSource.skin_color}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Eye Color: </Text>
                                <Text>{this.state.dataSource.eye_color}</Text>
                            </Text>
                            <Text>
                                <Text style={styles.bold}>Hair Color: </Text>
                                <Text>{this.state.dataSource.hair_color}</Text>
                            </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                                <Button transparent textStyle={{ color: '#87838B' }}>
                                    <Icon name="logo-github"/>
                                    <Text>1,926 stars</Text>
                                </Button>
                            </Left>
                        </CardItem>
                    </Card>
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
    },
    bold: {
        fontWeight: 'bold'
    }
});
