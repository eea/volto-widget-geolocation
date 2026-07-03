# syntax=docker/dockerfile:1
ARG VOLTO_VERSION
FROM plone/frontend-builder:${VOLTO_VERSION}

ARG ADDON_NAME
ARG ADDON_PATH
ENV HOST="0.0.0.0"

USER root
RUN --mount=type=cache,target=/var/cache/apt,sharing=locked \
    --mount=type=cache,target=/var/lib/apt,sharing=locked \
    apt-get update -q \
    && apt-get install -qy --no-install-recommends \
       chromium libgtk2.0-0 libgtk-3-0 libgbm-dev libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 libxtst6 xauth xvfb
USER node

COPY --chown=node:node ./ /app/src/addons/${ADDON_PATH}/

RUN /setupAddon

RUN --mount=type=cache,target=/home/node/.yarn,uid=1000,gid=1000,sharing=locked \
    yarn add jest-junit \
    && yarn install

ENTRYPOINT ["yarn"]
CMD ["start"]
