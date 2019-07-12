import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        age:'',
        annual_income:'',
        annual_spending:'',
        asset:'',
        total_asset:'',
        data: [{time: '2019-07-04', annual_income: 400}, {time: '2019-07-05', annual_income: 300}, {time: '2019-07-06', annual_income: 100}, {time: '2019-07-07', annual_income: 400}]
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  handleChange(event) {
    this.setState({annual_income: event.target.value});
  }

  handleSubmit(event) {
    alert('A time was submitted: ' + this.state.annual_income);
    //this.state.data.push({time: 'new', annual_income: this.state.annual_income}); // array破壊している。以下の方法またはstate.dataをオブジェクトコピーとして更新
    this.setState((state) => {
      return {data: state.data.concat({time: 'new', annual_income: parseInt(state.annual_income)})}
    });
    event.preventDefault();
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            annual_income:
            <input name="annual_income" value={this.state.annual_income} type="text" onChange={this.handleChange}/>
          </label>
          <input type="submit" value="Submit" />
        </form>
        {/* {console.log(this.state.data)} */}
        <LineChart width={600} height={300} data={this.state.data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
          <Line type="monotone" dataKey="annual_income" stroke="#8884d8" />
          <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
        </LineChart>
      </div>
    );
  }
}

