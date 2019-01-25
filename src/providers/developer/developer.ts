// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the DeveloperProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DeveloperProvider {

  reports:any = [];
  

  constructor() {
    console.log('Hello DeveloperProvider Provider');
  }

  listDetails(){
    return this.reports = [
      // { agency: 'PNP' , incidents: [
                { title: 'Murder Incident', shortTitle: 'murder' },
                { title: 'Kidnapping Incident', shortTitle: 'kidnap'},
                { title: 'Stalking Incident', shortTitle: 'stalking' },
                { title: 'Money Laundering Incident', shortTitle: 'money laundering' },
                { title: 'Prostitution', shortTitle: 'prostitution' },
                { title: 'Rape Incident', shortTitle: 'rape' },
                { title: 'Robbery Incident', shortTitle: 'robbery' },
                { title: 'Sexual Assualt Incident', shortTitle: 'sexual assualt' },
      // },
      // { agency: 'RTA', incidents: [
              { title: 'Traffic Jam' , shortTitle: 'traffic jam'},
              { title: 'Harassment Incident' , shortTitle: 'harassment'},
              { title: 'Multi-Vehicle Accident', shortTitle: 'multi-vehicle'},
              { title: 'Rear-End Accident',shortTitle: 'rear-end'},
              { title: 'Head-on Accident', shortTitle: 'head-on'},
              { title: 'Driving While Texting Accident', shortTitle: 'driving while texting'},
              { title: 'Drunk Driving Accident' , shortTitle: 'drunk driving'},
              { title: 'Hit and Run Accident', shortTitle:'hit and run'},
              { title: 'Road Rage', shortTitle: 'road rage' },
      // },
      // { agency: 'BFP', incidents: [
            { title: 'Wildfire', shortTitle: 'wildfire'},
            { title: 'Electrical Fire Accident', shortTitle:'electrical fire'},
            { title: 'Heater Fire Accident', shortTitle:'heater fire'},
            { title: 'Structural Fire Accident', shortTitle:'structural fire'},
            
      // }
            { title: 'Alarm', shortTitle: 'alarm' },
      { title: 'Alarm Test', shortTitle: 'alarm test' },
      { title: 'Animal Case', shortTitle: 'animal case' },
      { title: 'Assault', shortTitle: 'assault' },
      { title: 'Bomb Threat', shortTitle: 'bomb threat' },
      { title: 'Burglary', shortTitle: 'burglary' },
      { title: 'Carnapping', shortTitle: 'carnapping' },
      { title: 'Chemical emergencies', shortTitle: 'chemical emergencies' },
      { title: 'Child Abuse', shortTitle: 'child abuse' },
      { title: 'Curfew Violation', shortTitle: 'curfew violation' },
      { title: 'Dead Body', shortTitle: 'dead body' },
      { title: 'Death Threat', shortTitle: 'death threat' },
      { title: 'Demolition', shortTitle: 'demolition' },
      { title: 'Domestic Problem', shortTitle: 'domestic problem' },
      { title: 'Drug Racing', shortTitle: 'drug racing' },
      { title: 'Drowning', shortTitle: 'drowning' },
      { title: 'Drugs', shortTitle: 'drugs' },
      { title: 'Earthquake', shortTitle: 'earthquake' },
      { title: 'Explosion', shortTitle: 'explosion' },
      { title: 'Extorsion', shortTitle: 'extorsion' },
      { title: 'Flood', shortTitle: 'flood' },
      { title: 'Found Items', shortTitle: 'found items' },
      { title: 'Found Person', shortTitle: 'found person' },
      { title: 'Harassment', shortTitle: 'harassment' },
      { title: 'Hit and Run', shortTitle: 'hit and run' },
      { title: 'Hostage Taking', shortTitle: 'hostage taking' },
      { title: 'Illegal Activities', shortTitle: 'illegal activities' },
      { title: 'Inquiry', shortTitle: 'inquiry' },
      { title: 'Intoxicated Pedestrian', shortTitle: 'intoxicated pedestrian' },
      { title: 'Land Dispute', shortTitle: 'land dispute' },
      { title: 'Landslide', shortTitle: ',landslide' },
      { title: 'Lost Items', shortTitle: 'lost items' },
      { title: 'Medical Transport', shortTitle: 'medical transport' },
      { title: 'Missing Person', shortTitle: 'missing person' },
      { title: 'Noise Complaint', shortTitle: 'noise complaint' },
      { title: 'Riot', shortTitle: 'riot' },
      { title: 'Shooting Incident', shortTitle: 'shooting incident' },
      { title: 'Smoking Violation', shortTitle: 'smoking violation' },
      { title: 'Stabbing', shortTitle: 'stabbing' },
      { title: 'Structural Collapse', shortTitle: 'structural collapse' },
      { title: 'Suicide', shortTitle: 'suicide' },
      { title: 'Suspicious Circumstance', shortTitle: 'suspicious circumstance' },
      { title: 'Swindling', shortTitle: 'swinding' },
      { title: 'Theft', shortTitle: 'theft' },
      { title: 'Trapped', shortTitle: 'trapped' },
      { title: 'Trauma', shortTitle: 'trauma' }
    ];
  }
}
