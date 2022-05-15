sudo docker pull cr.yandex/$CR_REGISTRY/$CR_REPOSITORY:$IMAGE_TAG

containerIds=$(docker ps -a -q --filter "name=Frontend")
if [[ -n $containerIds ]] ; then
  sudo docker stop $containerIds
fi

sudo docker run --name Frontend.$GITHUB_RUN_NUMBER -d -p 80:80 cr.yandex/$CR_REGISTRY/$CR_REPOSITORY:$IMAGE_TAG

sudo docker system prune -a -f
