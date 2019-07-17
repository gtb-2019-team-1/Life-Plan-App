import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';

const LIFE_PLAN_APPS_ENDPOINT = "http://localhost:5000/data";


export default class App extends React.Component {
  constructor(props){
    super(props);
    let init_data = [];
    for(let age = 0; age <= 100; age++){
      init_data.push({age:(age), income:0, expenditure:0, savings:0});
    }
    
    this.state = {
      starting_age:'',
      data: init_data,
      got_data:[
          {age: 20, income: 200, expenditure:100, savings:0},
          {age: 21, income: 200, expenditure:150, savings:50},
          {age: 22, income: 300, expenditure:200, savings:150}
      ]
    };
    this.handleUpdateStartingAge = this.handleUpdateStartingAge.bind(this);
    this.getData = this.getData.bind(this);
    this.handleGetByAPI = this.hrandleGetByAPI.bind(this);
  }
  
  componentDidMount(){}
  
  componentWillUnmount(){}

  handleUpdateStartingAge(event){
    this.setState({starting_age: event.target.value});
  }

  hrandleGetByAPI(){
    axios
      .get(LIFE_PLAN_APPS_ENDPOINT)
      .then(response => {
        console.log(response.data)
        this.setState((state) => {
          return{
            weather:response.data[0].weather
          }
        });
      })
      .catch(() => {
        console.log('APIとの通信失敗');
      });
  }
  getData(event){
    let copied_data = this.state.data.slice();
    let copied_got_data = this.state.got_data.slice();
    for(let i=0; i<copied_got_data.length; i++){
      for(let j=0; j<copied_data.length; j++){
        if(copied_data[j].age === copied_got_data[i].age) copied_data[j] = copied_got_data[i];
      }
    }
    this.setState((state) => {
      return {
        data: copied_data
      }
    });
    event.preventDefault();
  }
  
  render(){
    return (
      <div>
        <form>
          <label>
            starting_age:
            <input name="starting_age" value={this.state.starting_age} type="text" onChange={this.handleUpdateStartingAge} />
          </label>
          <br />this.state.starting_age: {this.state.starting_age}<br />
        </form>
        <a onClick={this.getData} data={this.state.data} got_data={this.state.got_data}>げっとぐらふでーた</a>
        <br />
        <a onClick={this.handleGetByAPI} data={this.state.weather}>さーばーさんでーたをください</a>
        <br />
        <LineChart width={1000} height={500} data={this.state.data}>
          <Tooltip/>
          <XAxis dataKey="age" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="income" stroke="#008080" strokeWidth={2} />
          <Line type="monotone" dataKey="expenditure" stroke="#ff6644" strokeWidth={2} />
          <Line type="monotone" dataKey="savings" stroke="#006400" strokeWidth={2} />
        </LineChart>
      </div>
    );
  }
}

