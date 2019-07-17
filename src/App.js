import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';

const LIFE_PLAN_APPS_ENDPOINT = "http://localhost:5000/data";


export default class App extends React.Component {
    constructor(props) {
        super(props);
        let init_data = [];
        for(let age = 0; age <= 100; age++){
            init_data.push({age:(age), income:0, expenditure:0, savings:0});
        }
        
        this.state = {
            weather:'',
            starting_age:20,
            data: init_data,
            got_data: [{age: 20, income: 200, expenditure:100, savings:0}, {age: 21, income: 200, expenditure:150, savings:50}, {age: 22, income: 300, expenditure:200, savings:150}]
        };
        this.annualIncomeHandleChange = this.annualIncomeHandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getData = this.getData.bind(this);
        this.handleGetByAPI = this.hrandleGetByAPI.bind(this);
    }
  
    componentDidMount() {}
  
    componentWillUnmount() {}
  
    annualIncomeHandleChange(event) {
      this.setState({income: event.target.value});
    }
  
    handleSubmit(event) {
        this.setState((state) => {
          return {
              data: state.data.concat({age: 120, income: parseInt(state.income)})
          }
        });
        event.preventDefault();
    }
    hrandleGetByAPI(event){
        axios
            .get(LIFE_PLAN_APPS_ENDPOINT)
            .then(response => {
              console.log(response.data)
              this.setState({
                  weather:response.data[0].weather
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
  
    render() {
        return (
            <div>
                {/*
                <form onSubmit={this.handleSubmit}>
                    <label>
                        income:
                        <input name="income" value={this.state.income} type="text" onChange={this.annualIncomeHandleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                */}
                <a onClick={this.getData} data={this.state.data} got_data={this.state.got_data}>げっとぐらふでーた</a>
                <br />
                <a onClick={this.handleGetByAPI} data={this.state.weather}>さーばーさんでーたをください</a>
                <br />
                {this.state.weather}
                {/* {console.log(this.state.data)} */}
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

