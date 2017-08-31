import React from 'react';
import {
    StyleSheet,
    Image,
    View
} from 'react-native';
import {
    Container,
    Content,
    Spinner
} from 'native-base/src';
import colors from '../native-base-theme/variables/commonColor';

const background = require('./images/codehangar-transparent.png');

export default class BrandedContainer extends React.PureComponent {
    getLowerStyles = () => {
        switch (this.props.size) {
            case'sm':
                return styles.sm;
            case'md':
                return styles.md;
            case'lg':
            default:
                return styles.lg;
        }
    };

    wrapLowerContent = (lowerContent) => {
        const lowerStyles = this.getLowerStyles();
        return (
            <Container>
                <Content contentContainerStyle={styles.container}>
                    <View style={styles.upper}>
                        <Image source={background} style={styles.shadow} resizeMode="contain"/>
                    </View>
                    <View style={lowerStyles}>
                        {lowerContent}
                    </View>
                </Content>
            </Container>
        );
    };

    render() {
        if (this.props.isLoading) {
            return this.wrapLowerContent(<Spinner/>);
        }

        return this.wrapLowerContent(this.props.children);
    }
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    upper: {
        flex: 1,
        backgroundColor: colors.brandSidebar,
        padding: 20
    },
    lg: {
        flex: 2,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    md: {
        flex: 3,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    sm: {
        flex: 4,
        justifyContent: 'center',
        marginHorizontal: 20
    },
    shadow: {
        flex: 1,
        width: null
    }
});
