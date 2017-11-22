newArray = (size) => {
    var result = new Array(size);
    for (var i = 0; i < size; i++) {
        result[i] = new Array(size);
    }

    return result;
}

padArray = (originalArray, fat) => {
  result = newArray(originalArray.length + fat * 2);

  for (var i = 0; i < fat; i++) {
    result[i].fill(0);
    result[originalArray.length + fat + i].fill(0);
  }

  for (var i = 0; i < originalArray.length; i++) {
    var originalArrayRow = originalArray[i].slice(); // clones the array
    for (var j = 0; j < fat; j++ ){
      originalArrayRow.push(0);
      originalArrayRow.unshift(0);
    }
    result[i+fat] = originalArrayRow;
  }

  return result;
}

convolveArrays = (filter, image) => {
  var result = newArray(image.length - filter.length + 1); // padding!

  for (var i = 0; i < image.length; i++) {
    var imageRow = image[i];
    for (var j = 0; j <= imageRow.length; j++) {
      // for every cell

      var sum = 0;
      for (var w = 0; w < filter.length; w++) {
        if(image.length - i < filter.length) break; // padding!

        var filterRow = filter[w];
        for (var z = 0; z < filter.length; z++) {
          if(imageRow.length - j < filterRow.length) break; // padding!
          sum += image[w + i][z + j] * filter[w][z];
        }
      }

      if(i < result.length && j < result.length)
        result[i][j] = sum;
    }   
  }

  return result;
}

prettyLife = (cell) => (cell === 1) ? '██' : '░░';

lifeRules = (neighbours, alive) => {
  if (alive === 1) {
    if (neighbours < 2 || neighbours > 3) {
      return 0;
    }
    else return 1;
  }
  else if (alive === 0) {
    if (neighbours === 3) {
      return 1
    }
    else return 0;
  }
}

const life = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
];

const life2 = [
  [0, 1, 1, 1, 0],
  [1, 1, 1, 1 ,1],
  [1, 1, 0, 1, 1],
  [1, 1, 1, 1 ,1],
  [0, 1, 1, 1 ,0]
];

const test1 = [
  [1,1,1],
  [1,1,1],
  [1,1,1]
]

const test2 = [
  [1,1,1,1],
  [1,0,0,1],
  [1,0,0,1],
  [1,1,1,1]
]

const test3 = [
  [0,0,0,0],
  [0,1,0,0],
  [0,0,1,0],
  [0,0,0,0]
]

// console.log(padArray(test1, 0));
// console.log(padArray(test1, 1));
// console.log(padArray(test1, 2));
// console.log(padArray(test1, 3));
// console.log(padArray(test1, 4));

// console.log(convolveArrays(life, test1)); //makes a 1 point, from 3x3 filte, and 3x3 image
// console.log(convolveArrays(life, test2));
// console.log(convolveArrays(life, test3));



// life goes on
doLife = (currentState, padding, life, lifeRules) => {
  process.stdout.write('\033c');
  currentState = padArray(currentState, padding);
  let convolved = convolveArrays(life, currentState);
  let renderBuffer = newArray(convolved.length);

  for (i = 0; i < convolved.length; i++){
    for (j = 0; j < convolved.length; j++){
      renderBuffer[i][j] = lifeRules(convolved[i][j], currentState[i+padding][j+padding]);
      process.stdout.write( prettyLife(renderBuffer[i][j]));
    }
    process.stdout.write('\n');
  }
  process.stdout.write('\n');
  return renderBuffer;
}

gol = (lifeKernel, lifeRules, frameRate = 100, size = 32) => {
  const padding = Math.floor(lifeKernel.length / 2);
  var initialState = newArray(size);
  for (i = 0; i < initialState.length; i++){
    for (j = 0; j< initialState.length; j++){
      initialState[i][j] = Math.round(Math.random());
    }
  }
  var nextState = newArray(size);
  nextState = doLife(initialState, padding, lifeKernel, lifeRules);
  setInterval(function () {nextState = doLife(nextState, padding, lifeKernel, lifeRules)}, frameRate);
}

// LIVE!
gol(life, lifeRules, 50, 32);
