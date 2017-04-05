#
# includes node 6
#
FROM mhart/alpine-node:base-6.10.2

MAINTAINER darryl west <darryl@raincitysoftware.com.com>

# create a user
ENV user app
RUN adduser -h /home/$user -s /bin/sh -D -G wheel $user

WORKDIR /home/$user
RUN mkdir logs \
    && mkdir reports \
    && chmod a+rw logs reports \
    && chown $user *

EXPOSE 13001
VOLUME /src

USER $user
ENV NODE_ENV production

WORKDIR /home/$user

CMD [ "node", "app/app.js", "--env", "production" ]
