const output = $("#output");
const form = $("#calc_form");
const operand_btns = $("button[data-type='operand']");
const operator_btns = $("button[data-type='operator']");

form.on("submit", (e) => {
  e.preventDefault();
});

let is_operator = false;
let equation = [];

const remove_active = () => {
  operator_btns.removeClass("active");
};

operand_btns.on("click", (e) => {
  remove_active();
  const value = e.target.value;
  if (output.val() === "0" && value === ".") {
    output.val("0" + value);
  } else if (output.val() === "0") {
    output.val(value);
  } else if (output.val().length > 9) {
    output.val(output.val().substring(0, 9));
  } else if (is_operator) {
    is_operator = false;
    output.val(value);
  } else if (output.val().includes(".")) {
    output.val(output.val() + "" + value.replace(".", ""));
  } else {
    output.val(output.val() + "" + value);
  }
});

operator_btns.on("click", (e) => {
  remove_active();
  const value = e.target.value;
  $(e.currentTarget).addClass("active");

  switch (value) {
    case "%":
      output.val(parseFloat(output.val()) / 100);
      break;
    case "invert":
      output.val(parseFloat(output.val()) * -1);
      break;
    case "=":
      if (is_operator) {
        output.val(" Invalid");
        equation = [];
        break;
      }
      equation.push(output.val());
      try {
        let result = eval(equation.join(""));
        if (!isFinite(result)) {
          throw new Error("Error");
        }
        output.val(result);
        equation = [];
      } catch (err) {
        output.val(err.message);
      }
      break;
    default:
      let last_item = equation[equation.length - 1];
      if (["/", "*", "+", "-"].includes(last_item) && is_operator) {
        equation.pop();
        equation.push(value); 
      } else {
        equation.push(output.val());
        equation.push(value);
      }
      is_operator = true;
      break;
  }
});