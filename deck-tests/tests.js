var host = 'http://localhost';
var gate = 'http://localhost/gate'
var headless = false;

var Nightmare = require('nightmare');
var expect = require('chai').expect;
var should = require('chai').should();
var request = require('request');
require('mocha-generators').install();

var env = {appname: "app" + Math.random().toString(36).substring(7)}

var pauseLength = 1000;
var deploy;



var updateScope = function (env) {
        scope = angular.element($('.modal-page')).scope();
        scope.$apply(function(){
          scope.newAppModal.application.name = env.appname;
          scope.newAppModal.application.email = "test@example.com";
          scope.newAppModal.application.account = [env.account];
        })
      };

//headless = true;
//pauseLength = 100;


describe('Spinnaker Tests', function() {
  it('Parse Environment', function() {
    request(gate + '/credentials', function (error, response, body) {
      if (error) throw error;
      var data = JSON.parse(body);
      env.account = data[0].name;
      env.platform = data[0].type;
    })
  });
});

describe('Spinnaker Tests', function() {
  this.timeout(200000);
  var nightmare;
  
  before(function *() {
    nightmare = Nightmare({
      show: !headless,
      setTimeout:200000
    });
  });

  afterEach(function*() {
    yield nightmare.wait(pauseLength)
  });
  
  after(function*() {
    yield nightmare.end()
  });
  
  
  it('Show Infrastructure Page', function*() {
    var result = yield nightmare
      .goto(host)
      .wait(".infrastructure")
      .visible(".infrastructure")
    expect(result).to.equal(true);
  });

  it('Show Application Page', function*() {
    var result = yield nightmare
      .click('a[ui-sref="home.applications"]')
      .wait("th[key='email']")
      .visible(".applications")
    expect(result).to.equal(true);
  });

  it('Create Application', function*() {
    var result = yield nightmare
      .click('a[ng-click="action.action(); status.isOpen = false"]')
      .wait(".modal-body")
      .evaluate(updateScope, env)
      .click('button[type="submit"]')
      .wait(".application-header h2")
      .visible(".application-header h2")
    expect(result).to.equal(true);
  });
  
  /*

  it('Create Security Group', function*() {
    var result = yield nightmare
      .click('a[ui-sref=".insight.securityGroups"]')
      .wait('.header-clusters')
      .click('button[ng-click="ctrl.createSecurityGroup()"]')
      .wait('.modal-body')
      .evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.securityGroup.description = "description";
        });
      }, '.selector')
     
      
      if(env.platform == 'aws'){
        nightmare.select("select[ng-model='securityGroup.vpcId']", 'vpc-5100bf34')
        nightmare.evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.securityGroup.vpcId = 'vpc-5100bf34'
        });
      }, '.selector')
      }
      
      nightmare.click('.modal-footer .glyphicon-chevron-right')
      .wait(1000)
      
      if(env.platform == 'aws'){
        nightmare.click('button[ng-click="ctrl.addRule(securityGroup.securityGroupIngress)"]')
        
        .wait(1000)
        .click('.select2-choice')
        .wait(1000)
        .click('ul[role="listbox"] li:nth-child(1)')
        .evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.securityGroupIngress[0].endPort = 80; 
          scope.securityGroupIngress[0].startPort = 80;
        });
      }, '.selector')
      
      }
      
      if(env.platform == 'gce'){
      nightmare.click('button[ng-click="ctrl.addSourceCIDR(securityGroup.sourceRanges)"]')
      .click('button[ng-click="ctrl.addRule(securityGroup.ipIngress)"]')
      .evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.securityGroup.ipIngress[0].endPort = 80; 
          scope.securityGroup.ipIngress[0].startPort = 80;
        });
      }, '.selector')
      }
      
     
      nightmare.wait(1000)
      .click('wizard-page[key="Ingress"] .btn-primary')
      .wait('.task-progress-refresh .glyphicon-ok-circle')
      .visible('.task-progress-refresh .glyphicon-ok-circle')
    expect(result).to.equal(true);
  });
  
  it('Create Load Balancer', function*() {
    var result = yield nightmare
      .click('a[ui-sref=".insight.loadBalancers"]') 
      .wait('.header-clusters .btn-default')
      .click('.header-clusters .btn-default')
      .wait('.modal-body')
      nightmare.select("select[ng-model='securityGroup.vpcId']", 'vpc-5100bf34')
        nightmare.evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.loadBalancer.vpcId = 'vpc-5100bf34'
        });
      }, '.selector')
      .click('wizard-page[key="Location"] .glyphicon-chevron-right')
      .wait(1000)
      
      if(env.platform == 'aws'){
          nightmare.click('wizard-page[key="Security Groups"] .select input')
          .click('wizard-page[key="Security Groups"] ul[role="listbox"] li:nth-child(1)')
          .click('wizard-page[key="Listeners"] .btn-primary')
      }
      
      if(env.platform == 'gce'){
       nightmare.click('wizard-page[key="Listener"] .modal-footer .glyphicon-chevron-right')
      .wait(1000)
      .evaluate(function (selector) {
        scope = angular.element($("modal-wizard")).scope();
        scope.$apply(function(){
          scope.loadBalancer.listeners[0].portRange = 80;
          scope.loadBalancer.healthyThreshold = 2;
        });
      }, '.selector')
      .wait(1000)
      }
      
      nightmare.click('wizard-page[key="Health Check"] .btn-primary')
      .wait('.task-progress-refresh .glyphicon-ok-circle')
      .wait(10000   )
      .visible('.task-progress-refresh .glyphicon-ok-circle')
    expect(result).to.equal(true);
  });
  */
  
  it('Create Pipeline', function*() {
    var result = yield nightmare
      .click('a[ui-sref=".executions"]')
      .wait('h4')
      .wait(pauseLength)
      .click('create-new .btn-default')
      .click('create-new ul a')
      .evaluate(function (selector) {
        scope = angular.element($("div[modal-page]")).scope();
        scope.$apply(function(){
          scope.command.name = "testpipeline";
        });
      }, '.selector')
      .click('.modal-footer .btn-primary')
      .wait('.pipeline-contents')
      .visible('.pipeline-contents')
    expect(result).to.equal(true);
  });
  
  
  it('Add Bake Stage', function*() {
    var result = yield nightmare
      .click('button[ng-click="pipelineConfigurerCtrl.addStage()"]')
      .visible('.pipeline-stage-config-heading')
      .click('.select2-choice')
      .wait(pauseLength)
      .click('ul[role="listbox"] li:nth-child(1)')
      .wait(pauseLength)
      .evaluate(function (selector) {
        scope = angular.element($(".form-horizontal")).scope();
        scope.$apply(function(){
          scope.stage.package = "apache2";
        });
      }, '.selector')
      .click(".pipeline-footer .btn-primary")
      .wait('.pipeline-footer .glyphicon-ok-circle')
      .visible('.pipeline-footer .glyphicon-ok-circle')
    expect(result).to.equal(true);
  });
  /*
  
  
  it('Add Deploy Stage', function*() {
    var result = yield nightmare
      .wait(1000)
      .click('button[ng-click="pipelineConfigurerCtrl.addStage()"]')
      .visible('.pipeline-stage-config-heading')
      .click('.select2-choice')
      .wait(1000)
      .click('ul[role="listbox"] li:nth-child(3)')
      .wait(1000)
      .wait("button[ng-click='deployStageCtrl.addCluster()']")
      .click("button[ng-click='deployStageCtrl.addCluster()']")
      .wait('.modal-body')
      .click('.modal-footer .btn-primary')
      .wait(1000)
      .click('modal-wizard[heading="Configure Deployment Cluster"] .btn-primary')
      .wait(1000)
      .click('wizard-page[key="load-balancers"] .select2 input')
      .wait(1000)
      .click('ul[role="listbox"] li:nth-child(1)')
      .wait(1000)
      .click('wizard-page[key="load-balancers"] .btn-primary')
      .wait(1000)
      .click("wizard-page[key='security-groups'] .select2 input")
      .wait(1000)
      .click('ul[role="listbox"] li:nth-child(1)')
      .wait(1000)
      .click('wizard-page[key="security-groups"] .btn-primary')
      .wait(1000)
      .click("instance-archetype-selector .archetype-columns:nth-child(5) button")
      .click('wizard-page[key="instance-profile"] .btn-primary')
      .wait(1000)
      .click("instance-type-selector tr:nth-child(2)")
      .click('wizard-page[key="instance-type"] .btn-primary')
      .wait(1000)
      .click('wizard-page[key="capacity"] button[ng-click="wizard.nextPage(form.$valid)"]')
      .wait(1000)
      .click('wizard-page[key="advanced"] .btn-primary')
      .wait(1000)
      .click(".pipeline-footer .btn-primary")
      .wait('.pipeline-footer .glyphicon-ok-circle')
      .visible('.pipeline-footer .glyphicon-ok-circle')
      .click('.glyphicon-circle-arrow-left')
      .wait('.execution-group-heading')
      .visible('.execution-group-heading')
    expect(result).to.equal(true);
  });
  
   it('Start Pipeline', function*() {
    var result = yield nightmare
      .click('.execution-group-heading a[ng-click="vm.triggerPipeline(); $event.stopPropagation();"]')
      .wait('.modal-body')
      .click('.modal-footer .btn-primary')
      .wait('.execution-bar')
      .visible('.execution-bar')
    expect(result).to.equal(true);
  });
  
  it('Bake Stage Complete', function*() {
    this.timeout(200000);
    var result = yield nightmare
      .click('.stages .stage:nth-child(1)')
      .wait('.execution-details .label-completed')
      .visible('.execution-details .label-completed')
    expect(result).to.equal(true);
  });
  
  it('Deploy Stage Complete', function*() {
    this.timeout(300000);
    var result = yield nightmare
      .click('.stages .stage:nth-child(2)')
      .wait('.execution-details .label-completed')
      .visible('.execution-details .label-completed')
    expect(result).to.equal(true);
  });
  
  
  
 it('Delete Cluster', function*() {
    var result = yield nightmare
      .wait(1000)
      .goto("http://localhost:9000/#/applications/" + env.appname + "/clusters")
      .wait('cluster-pod .rollup-details')
      .click('div[ng-click="loadDetails($event)"]')
      .wait(1000)
      .click('a[ng-click="ctrl.destroyServerGroup()"]')
      .wait('.modal-body')
      .evaluate(function (env) {
        scope = angular.element($("div[modal-page]")).scope();
        scope.$apply(function(){
          scope.verification.verifyAccount = env.account.toUpperCase();
        });
      }, env)
      .wait(1000)
      .click('.modal-footer .btn-primary')
      .wait('ul.task-progress li:nth-child(10)')
      .visible('ul.task-progress li:nth-child(10)')
    expect(result).to.equal(true);
  });
  
 it('Delete Security Group', function*() {
    var result = yield nightmare
      .goto("http://localhost:9000/#/applications/" + env.appname + "/securityGroups")
      .wait('security-group-pod .rollup-details')
      .click('div[ng-click="loadDetails($event)"]')
      .wait(1000)
      .click('a[ng-click="ctrl.deleteSecurityGroup()"]')
      .wait('.modal-body')
      .evaluate(function (env) {
        scope = angular.element($("div[modal-page]")).scope();
        scope.$apply(function(){
          scope.verification.verifyAccount = env.account.toUpperCase();
        });
      }, env)
      .wait(1000)
      .click('.modal-footer .btn-primary')
      .wait('.task-progress-refresh .glyphicon-ok-circle')
      .visible('.task-progress-refresh .glyphicon-ok-circle')
    expect(result).to.equal(true);
  });
  
  it('Delete Load Balancer', function*() {
    var result = yield nightmare
      .goto("http://localhost:9000/#/applications/" + env.appname + "/loadBalancers")
      .wait('load-balancer-pod .rollup-details')
      .click('div[ng-click="loadDetails($event)"]')
      .wait(1000)
      .click('a[ng-click="ctrl.deleteLoadBalancer()"]')
      .wait('.modal-body')
      .evaluate(function (env) {
        scope = angular.element($("div[modal-page]")).scope();
        scope.$apply(function(){
          scope.verification.verifyAccount = env.account.toUpperCase();
        });
      }, env)
      .wait(1000)
      .click('.modal-footer .btn-primary')
      .wait('.task-progress-refresh .glyphicon-ok-circle')
      .visible('.task-progress-refresh .glyphicon-ok-circle')
    expect(result).to.equal(true);
  });
  */
  
  /*
  it('Delete Application', function*() {
    var result = yield nightmare
      .click('a[ui-sref=".config"]')
      .wait('.panel-body')
      .wait(30000)
      .click('button[ng-click="vm.deleteApplication()"]')
      .wait('.modal-footer')
      .click('.modal-footer .btn-primary')
      .wait('.applications')
      .visible('.applications')
    expect(result).to.equal(true);
  });
  */
  
  
});
