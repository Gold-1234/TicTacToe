import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View} from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Sound from 'react-native-sound';

const XSound = new Sound(require('./X.mp3'), (error) => {
  if (error) {
    console.log('Error loading X Sound:', error);
    return;
  }
});

const OSound = new Sound(require('./O.mp3'), (error) => {
  if (error) {
    console.log('Error loading O Sound:', error);
    return;
  }
});

const win = new Sound(require('./win.mp3'), (error) => {
  if (error) {
    console.log('Error loading win Sound:', error);
    return;
  }
});

const tiex = new Sound(require('./tiee.mp3'), (error) => {
  if (error) {
    console.log('Error loading tie Sound:', error);
    return;
  }
});


function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const [value, setValue] = useState(Array(9).fill(null));
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');
  const [down, setDown] = useState<boolean>(false);
  const [countdown, setCountdown] = useState(3);
  const [tie, setTie] = useState('');
  const [turn, setTurn] = useState<{text: string, style: any}>({
    text: "Player X's Turn",
    style: styles.X
  });
  

 
  
  useEffect(() => {
    let intervalId: NodeJS.Timeout | undefined;
    if (down && countdown > 0){
       intervalId = setInterval(() => {
        setCountdown(prevCount => prevCount - 1);
      }, 1000)
     
    }else if(countdown <= 0){
      setDown(false);
      reset()
    }
    return() => {
      if(intervalId) clearInterval(intervalId);
    }
   
  }, [down, countdown]);

  const winningCombinations = [
    [0, 1, 2], // Top row
    [3, 4, 5], // Middle row
    [6, 7, 8], // Bottom row
    [0, 3, 6], // Left column
    [1, 4, 7], // Middle column
    [2, 5, 8], // Right column
    [0, 4, 8], // Diagonal from top-left to bottom-right
    [2, 4, 6], // Diagonal from top-right to bottom-left
  ];

  const handlePress = (index: number) => {
    if (value[index] || text) return;
    const newValue = [...value];
    newValue[index] = count % 2 === 0 ? 'X' : 'O';
    const newText = count % 2 === 0 ? "Player O's turn" : "Player X's turn";
    const stylex = count % 2 === 0 ? styles.O : styles.X;

    setTurn({style: stylex, text: newText})
    let newCount = count + 1;
    setCount(newCount);
    setValue(newValue);
    checkWinner(newValue);
    console.log("starting countdown");
    console.log(count);

    if(count % 2 === 0){
      playOSound();
    }else{
      playXSound();
    }

    const winner = checkWinner(newValue)
     
    if (winner) {
      setText(`${newValue[index]} WINS 🥳🎉`);
      console.log("starting checking");
      setDown(true)
      setCountdown(3);
      playWinSound();
    }
    else if(count === 8 && !winner){
      console.log('Tie');
      setTie('Match Tie!!');
      setDown(true);
      setCountdown(3);
      playtieSound();
    }
  }

  const reset = () => {
    setValue(Array(9).fill(null));
    setCount(0);
    setText('');
    setDown(false);
    setCountdown(3)
    setTurn({text: "Player X's turn", style: styles.X})
    console.log("starting reset");
  }

  const checkWinner = (values: (string | null)[]) => {
    for (const [a, b, c] of winningCombinations) {
      if (values[a] && values[a] === values[b] && values[b] === values[c]) {
        console.log("checking winner");
        return values[a];
      }
    }
    return null;
  }

  const playXSound = () => {
    XSound.play((success) => {
      if(success){
        console.log('Played Succesfully');
      }else{
        console.log('Failed to play the Sound'); 
      }
    })
  }

  const playOSound = () => {
    OSound.play((success) => {
      if(success){
        console.log('Played Succesfully');
      }else{
        console.log('Failed to play the Sound'); 
      }
    })
  }
  const playWinSound = () => {
    win.play((success) => {
      if(success){
        console.log('Played Succesfully');
      }else{
        console.log('Failed to play the Sound'); 
      }
    })
  }
  const playtieSound = () => {
    tiex.play((success) => {
      if(success){
        console.log('Played Succesfully');
      }else{
        console.log('Failed to play the Sound'); 
      }
    })
  }
 
 
  return (

    <SafeAreaView style={{ backgroundColor: '#1E2A5E', height: '100%' }}>
      <ScrollView>
        <StatusBar />
        <View style={styles.header}>
          <Text style={styles.heading}>TIC TAC TOE</Text>
          <Text style = {turn.style}>{turn.text}</Text>
        </View>
        <View style={styles.container}>
          {value.map((values, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(index)}
              style={styles.button}>
              <Text style={styles.value}>{values}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.reset} onPress={reset}>
            <Text style={styles.resetBtn}>Reset</Text>
          </TouchableOpacity>
          {down && (
            
            <View style = {styles.view}>
            <Text style={styles.text}>{text}</Text>
            <Text style = {styles.tieText}>{tie}</Text>
            <Text style = {styles.lowerText}>Resetting the game in...</Text>
            <Text style = {styles.text}>{countdown > 0 ? countdown  :  ''}</Text>

            </View>
          )}
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 30,
    margin: 20,
    color: 'white'
  },
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#E1D7B7',
    height: 80,
    width: 80,
    margin: 10,
    borderRadius: 10,
    elevation: 4,
    shadowColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  bottom: {
    alignItems: 'center',
  },
  resetBtn: {
    color: 'white',
    fontSize: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reset: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7C93C3',
    borderRadius: 20,
    width: 150,
    height: 40,
    fontWeight: 'bold',
    margin: 20
  },
  text: {
    color: 'gold',
    fontSize: 40,
    fontWeight: 'bold'
  },
  value: {
    fontSize: 30,
    fontWeight: 'bold'
  },
  lowerText:{
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20
  },
  view:{
    alignItems: 'center',
    justifyContent: 'center'
  },
  tieText:{
    color: 'red',
    fontWeight: 'bold',
    fontSize: 30
  },
  X:{
    color: 'black',
    backgroundColor: 'yellow',
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 25,
    borderRadius: 20,
    textAlign: 'center'
  },
  O:{
    color: 'black',
    backgroundColor: 'pink',
    paddingHorizontal: 30,
    paddingVertical: 10,
    fontSize: 25,
    alignItems: 'center',
    borderRadius: 20,
    justifyContent: 'center',
    textAlign: 'center'

  }
});

export default App;