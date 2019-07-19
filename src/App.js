import React from 'react';
import './App.css';
import {LineChart, Line, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip} from 'recharts';
import axios from 'axios';
import { exportDefaultSpecifier } from '@babel/types';

const LIFE_PLAN_APPS_ENDPOINT = "http://localhost:5000/data";
const INTERVAL_OF_AVERAGE = 5;


export default class App extends React.Component {
  constructor(props){
    super(props);

    //１９歳以下  ２０～２４  ２５～２９  ３０～３４  ３５～３９  ４０～４４  ４５～４９  ５０～５４  ５５～５９  ６０～６４  ６５～６９  ７０歳以上
    let average_income = [132,262,361,407,442,468,496,519,516,396,314,288/*432,432,432,432,432*/]; // interval is 5
    let average_expenditure = [186,186,186,183,183,183,183,183,215,215,215,215/*,215,215,215,215,215*/]; // ~34, 35~59, 60~
    let init_data = [];
    let init_average_data = [];
    let average_savings = 0;
    for(let age = 20; age <= 75; age=age+INTERVAL_OF_AVERAGE){
      init_data.push({age:(age), income:0, expenditure:0, savings:0});
      average_savings = average_savings + average_income[(age-20)/INTERVAL_OF_AVERAGE]-average_expenditure[(age-20)/INTERVAL_OF_AVERAGE];
      init_average_data.push({
        age:(age),
        income:average_income[(age-20)/INTERVAL_OF_AVERAGE],
        expenditure:average_expenditure[(age-20)/INTERVAL_OF_AVERAGE],
        savings:average_savings
      })
    }
    // console.log(init_average_data)
    this.state = {
      starting_age:0,
      expenditure_age:0,
      expenditure_price:0,
      data: init_data,
      average_data:init_average_data,
      got_data:[
        {age: 20, income: 200, expenditure:100, savings:0},
        {age: 25, income: 200, expenditure:150, savings:50},
        {age: 30, income: 300, expenditure:200, savings:150}
      ]
    };
    this.handleUpdateStartingAge = this.handleUpdateStartingAge.bind(this);
    this.getData = this.getData.bind(this);
    this.handleGetByAPI = this.hrandleGetByAPI.bind(this);
    this.BigExpenditureEvent = this.BigExpenditureEvent.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  
  componentDidMount(){}
  
  componentWillUnmount(){}

  handleUpdateStartingAge(event){
    this.setState({starting_age: event.target.value});
  }
  BigExpenditureEvent(event){
    this.setState({[event.target.name]: event.target.value});
  }

  handleSubmit(event){
    let copied_data = this.state.data.slice();
    let copied_expenditure_age = this.state.expenditure_age;
    let copied_expenditure_price = this.state.expenditure_price;
    for(let i=0; i<copied_data.length; i++){
      if(copied_data[i].age === parseInt(copied_expenditure_age)){
        copied_data[i].expenditure = copied_expenditure_price;
        copied_data[i].savings = copied_data[i].savings - copied_expenditure_price;
      }
    }

    this.setState((state) => {
      return {
        data : copied_data
      }
    });
    event.preventDefault();
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
    let copied_average_data = this.state.average_data.slice();
    let ratio_of_income = 1;
    let ratio_of_expenditure = 1;

    for(let i=0; i<copied_data.length; i++){
      for(let j=0; j<copied_got_data.length; j++){
        if(copied_data[i].age === copied_got_data[j].age){
          copied_data[i] = copied_got_data[j];
          // 収支について平均との比を求める
          if(j==0){
            ratio_of_income = copied_average_data[i].income / copied_got_data[j].income;
            ratio_of_expenditure = copied_average_data[i].expenditure / copied_got_data[j].expenditure;
          }else{
            ratio_of_income = (ratio_of_income + copied_average_data[i].income / copied_got_data[j].income) / j;
            ratio_of_expenditure = (ratio_of_expenditure + copied_average_data[i].expenditure / copied_got_data[j].expenditure) / j;
          }
          console.log("ratio_of_income is ", ratio_of_income)
          console.log("ratio_of_expenditure is ", ratio_of_expenditure)
        }
      }
    }

    for(let i=copied_got_data.length; i<copied_data.length; i++){
      copied_data[i].income = parseInt(copied_average_data[i].income * ratio_of_income);
      copied_data[i].expenditure = parseInt(copied_average_data[i].expenditure * ratio_of_expenditure);
      copied_data[i].savings = parseInt(copied_data[i-1].savings + copied_average_data[i].income * ratio_of_income - copied_average_data[i].expenditure * ratio_of_expenditure);
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
        {this.state.expenditure_age}
        {this.state.expenditure_price}
        <form>
          <label>
            いつ:
            <input name="expenditure_age" value={this.state.expenditure_age} type="text" onChange={this.BigExpenditureEvent} />
          </label>
          <br />金額:<input name="expenditure_price" value={this.state.expenditure_price} type="text" onChange={this.BigExpenditureEvent} />
          <button onClick={this.handleSubmit}>
            send
          </button><br />
        </form>
        <a onClick={this.getData} data={this.state.data} got_data={this.state.got_data} average_data={this.state.average_data}>げっとぐらふでーた</a>
        <br />
        <a onClick={this.handleGetByAPI} data={this.state.weather}>さーばーさんでーたをください</a>
        <br />
        {/*** 入力値を取得した限り, 未入力の部分は入力値と平均との比をとってプロット ***/}
        <LineChart width={1000} height={500} data={this.state.data}>
          <Tooltip/>
          <XAxis dataKey="age" />
          <YAxis />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5"/>
          <Line type="monotone" dataKey="income" stroke="#008080" strokeWidth={2} />
          <Line type="monotone" dataKey="expenditure" stroke="#ff6644" strokeWidth={2} />
          <Line type="monotone" dataKey="savings" stroke="#006400" strokeWidth={2} />
        </LineChart>
        {/*** 平均値プロット ***/}
        <LineChart width={1000} height={500} data={this.state.average_data}>
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

