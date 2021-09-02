import subprocess
import os

if __name__ == '__main__':
  os.chdir("/home/octa/Networks/ud3tn")

  # Create dtn node 1 in network
  cmd_node1 = 'build/posix/ud3tn --eid dtn://host1.dtn --bp-version 7 --aap-port 4242 --cla "mtcp:*,4224"'

  # Create dtn node 2 in network
  cmd_node2 = 'build/posix/ud3tn --eid dtn://host2.dtn --bp-version 7 --aap-port 4243 --cla "mtcp:*,4225"'

  # Configure µD3TN instance for sending data from host1 to host2
  config_node1 = 'python3 tools/aap/aap_config.py --tcp localhost 4242 --dest_eid dtn://host1.dtn --schelude 1 3600 100000 dtn://host2.dtn mtcp:localhost:4225'

  print("RUNNIGN PROCESS 1", cmd_node1)
  subprocess.Popen(cmd_node1.split(" ")).wait()

  print("RUNNIGN PROCESS 2", cmd_node2)
  subprocess.Popen(cmd_node2.split(" ")).wait()

  print("RUNNIGN PROCESS 3", config_node1)
  subprocess.Popen(config_node1.split(" ")).wait()