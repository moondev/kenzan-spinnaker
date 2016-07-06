import yaml
import os
import time
import collections
import subprocess

def runHealth(name, port):
  portOpen = False
  while portOpen == False:
    result = subprocess.check_output("docker exec -it spinnaker_pingbox_1 nmap -p " + str(port) + ' ' + name + '-alias', shell=True)
    if "open" in result:
      print name + " is running."
      portOpen = True
    else:
      print "waiting for " + name + " to start..."
      time.sleep(2)

def startContainer(name, port):
  os.system("docker-compose up -d " + name)
  runHealth(name, port)

os.system("python config.py")

os.system("docker-compose down")
os.system("docker-compose up -d pingbox")
time.sleep(5)
os.system("docker exec -it spinnaker_pingbox_1 apt-get update")
os.system("docker exec -it spinnaker_pingbox_1 apt-get install -y nmap")
os.system("docker-compose up -d configdata")
time.sleep(5)
#os.system("docker exec -it spinnaker_configdata_1 nmap -p 6379 redis-alias")
#result = subprocess.check_output("docker exec -it spinnaker_configdata_1 nmap -p 6379 redis-alias", shell=True)
#print result

startContainer("redis",6379)
startContainer("cassandra",9160)
time.sleep(1)
os.system("docker exec -it spinnaker_cassandra_1 cqlsh -e \"CREATE KEYSPACE IF NOT EXISTS front50 WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };\"")
os.system("docker exec -it spinnaker_cassandra_1 cqlsh -e \"CREATE KEYSPACE IF NOT EXISTS echo WITH REPLICATION = { 'class' : 'SimpleStrategy', 'replication_factor' : 1 };\"")
os.system("docker exec -it spinnaker_cassandra_1 nodetool enablethrift")
startContainer("front50",8080)
startContainer("clouddriver",7002)
startContainer("rosco",8087)
startContainer("orca",8083)
startContainer("gate",8084)
os.system("docker-compose up -d deck")
