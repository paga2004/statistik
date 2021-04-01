const formulas = {
  arithmetisch: {
    formulas: [
      "\\bar{x} = \\frac{1}{n}(x_1 + x_2 + \\ldots + x_n)",
      "\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} x_i",
    ],
    computation: mean,
  },
  modalwert: {
    formulas: ["D = \\text{häufigster Wert}", "D = \\text{häufigster Wert}"],
    computation: (l) => {
      let n = l.length;
      if (n == 0) return NaN;
      let counts = {};

      for (let i = 0; i < n; i++) {
        let num = l[i];
        counts[num] = counts[num] ? counts[num] + 1 : 1;
      }
      let frequencies = Object.entries(counts);
      frequencies.sort((a, b) => b[1] - a[1]);

      return parseFloat(frequencies[0][0]);
    },
  },
  median: {
    formulas: [
      "\\tilde{x} = \\text{Wert genau in der Mitte der sortierten Liste}",
      "\\tilde{x} = \\text{Wert genau in der Mitte der sortierten Liste}",
    ],
    computation: (l) => {
      let n = l.length;
      if (n == 0) return NaN;
      l.sort();
      if (n % 2) {
        return l[Math.floor(n / 2)];
      } else {
        return (l[n / 2 - 1] + l[n / 2]) / 2;
      }
    },
  },
  max: {
    formulas: ["x_{\\max}", "x_{\\max}"],
    computation: max,
  },

  min: {
    formulas: ["x_{\\min}", "x_{\\min}"],
    computation: min,
  },
  range: {
    formulas: ["R = x_{\\max} - x_{\\min}", "R = x_{\\max} - x_{\\min}"],
    computation: (l) => max(l) - min(l),
  },

  mAvM: {
    formulas: [
      "d_\\bar{x} = \\frac{1}{n}(\\lvert x_1 - \\bar{x} \\rvert + \\lvert x_2 - \\bar{x} \\rvert + \\ldots + \\lvert x_n - \\bar{x} \\rvert)",
      "d_\\bar{x} = \\frac{1}{n} \\sum_{i=1}^{n} \\lvert x_i - \\bar{x} \\rvert",
    ],
    computation: (l) => {
      if (l.length) {
        let m = mean(l);
        return sum(l.map((x) => Math.abs(x - m))) / l.length;
      } else {
        return NaN;
      }
    },
  },
  empirischeVarianz: {
    formulas: [
      "s^2 = \\frac{1}{n-1}((x_1 - \\bar{x})^2 + (x_2 - \\bar{x})^2 + \\ldots + (x_n - \\bar{x})^2)",
      "s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} ( x_i - \\bar{x} )^2",
    ],
    computation: (l) => empirischeVarianz(l),
  },
  empirischeStandardabweichung: {
    formulas: ["s = \\sqrt{s^2}", "s = \\sqrt{s^2}"],
    computation: (l) => Math.sqrt(empirischeVarianz(l)),
  },
};

function sum(l) {
  if (l.length) return l.reduce((x, y) => x + y);
  else return NaN;
}

function mean(l) {
  if (l.length) return sum(l) / l.length;
  else return NaN;
}

function max(l) {
  if (l.length) return l.reduce((p, v) => (p > v ? p : v));
  else return NaN;
}

function min(l) {
  if (l.length) return l.reduce((p, v) => (p < v ? p : v));
  else return NaN;
}

function empirischeVarianz(l) {
  if (l.length > 1) {
    let m = mean(l);
    return sum(l.map((x) => (x - m) * (x - m))) / (l.length - 1);
  } else {
    return NaN;
  }
}

function update() {
  const inputElem = document.getElementById("input");
  const list = document
    .getElementById("input")
    .value.replace(", ", " ")
    .split(/\s+/)
    .map(parseFloat)
    .filter((x) => !isNaN(x));

  inputElem.value = list.join(" ");

  const useSummationSymbol = document.getElementById("summationSymbol").checked
    ? 1
    : 0;

  for (const [key, value] of Object.entries(formulas)) {
    let result = "";
    result = value.computation(list, list.length);
    let rounded = Math.round((result + Number.EPSILON) * 1000) / 1000;
    if (isNaN(result)) result = "";
    else if (rounded == result) {
      result = " = " + result;
    } else {
      result = " \\approx " + rounded;
    }

    document.getElementById(key).innerHTML =
      "\\[" + value.formulas[useSummationSymbol] + result + "\\]";
  }
  MathJax.typeset();
}

window.onload = update;
