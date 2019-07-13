import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        let init_data = [];
        for(let age = 0; age <= 100; age++){
            init_data.push({age:(age), annual_income:0});
        }
        
        this.state = {
            starting_age:20,
            annual_income:0,
            annual_spending:0,
            asset:0,
            total_asset:0,
            data: init_data,
            got_data: [{age: 20, annual_income: 200}, {age: 21, annual_income: 200}, {age: 22, annual_income: 300}]
        };
        this.annualIncomeHandleChange = this.annualIncomeHandleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getData = this.getData.bind(this);
    }
  
    componentDidMount() {}
  
    componentWillUnmount() {}
  
    annualIncomeHandleChange(event) {
      this.setState({annual_income: event.target.value});
    }
  
    handleSubmit(event) {
        this.setState((state) => {
          return {
              data: state.data.concat({age: 120, annual_income: parseInt(state.annual_income)})
          }
        });
        event.preventDefault();
    }
  
    getData(event){
        let copied_data = this.state.data.slice();
        let copied_got_data = this.state.got_data.slice();
        for(let i=0; i<copied_got_data.length; i++){
             for(let j=0; j<copied_data.length; j++){
                 if(copied_data[j].age === copied_got_data[i].age) copied_data[j].annual_income = parseInt(copied_got_data[i].annual_income);
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
                        annual_income:
                        <input name="annual_income" value={this.state.annual_income} type="text" onChange={this.annualIncomeHandleChange}/>
                    </label>
                    <input type="submit" value="Submit" />
                </form>
                */}
                <a onClick={this.getData} data={this.state.data} got_data={this.state.got_data}>げっと！</a>
                {/* {console.log(this.state.data)} */}
                {console.log(this.state.data)}
                <LineChart width={1000} height={500} data={this.state.data}>
                    <XAxis dataKey="age" />
                    <YAxis />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
                    <Line type="monotone" dataKey="annual_income" stroke="#8884d8" />
                </LineChart>
            </div>
        );
    }
}

