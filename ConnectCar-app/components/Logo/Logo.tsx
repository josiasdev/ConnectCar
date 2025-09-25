import {Image, View, StyleSheet} from 'react-native';

const Logo = () => {
    return(
        <View style={styles.container}>
            <Image source={require('../../assets/Logo/logo-removebg-preview.png')} style={styles.logo}/>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignItems: 'center',
    },
    logo: {
      width: 150,  // Ajuste o tamanho conforme necessário
      height: 150,
      resizeMode: 'contain', // Mantém a proporção da imagem
    },
  });

export default Logo;