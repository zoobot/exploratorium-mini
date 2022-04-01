# Twilio-Block

![Twilio-Block](https://raw.githubusercontent.com/zoobot/twilio-block/main/logo.png)

### Hardware required:
- [Raspberry Pi](https://www.aliexpress.com/item/4000130040254.html?key=a7e37b5f6ff1de9cb410158b1013e54a&prodOvrd=RAC&opt=false&aff_fcid=4d2d920f11ef4078804fb898b3aa854b-1638805157605-08626-_9xk30H&tt=CPS_NORMAL&aff_fsk=_9xk30H&aff_platform=shareComponent-detail&sk=_9xk30H&aff_trace_key=4d2d920f11ef4078804fb898b3aa854b-1638805157605-08626-_9xk30H&terminal_id=5408ef9d287140f483e79c70c12dadf0)

### Deploying

[![Deploy with balena](https://balena.io/deploy.svg)](https://dashboard.balena-cloud.com/deploy?repoUrl=https://github.com/zoobot/twilio-block)

Or add the following service to your `docker-compose.yml`:

## Setup and configuration


## Intro


## Software

The application logic:


## Assembly

Schematic:


## Development

To deploy manually or debug the application, you'll need to have [balena cli](https://www.balena.io/docs/reference/balena-cli/) installed.

```bash
git clone https://github.com/zoobot/twilio-block.git
cd twilio-block
balena push <your_device_id>.local
```


---