import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        money:'',
        data: [{time: '2019-07-04', money: 400}, {time: '2019-07-05', money: 300}, {time: '2019-07-06', money: 100}, {time: '2019-07-07', money: 400}]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleChange(event) {
    this.setState({money: event.target.value});
  }

  handleSubmit(event) {
    alert('A time was submitted: ' + this.state.money);
    //this.state.data.push({time: 'new', money: this.state.money}); // array破壊している。以下の方法またはstate.dataをオブジェクトコピーとして更新
    this.setState((state) => {
      return {data: state.data.concat({time: 'new', money: parseInt(state.money)})}
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            Money:
            <input name="money" value={this.state.money} type="text" onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
        {/* {console.log(this.state.data)} */}
        <LineChart width={600} height={300} data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="money" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    );
  }
}

