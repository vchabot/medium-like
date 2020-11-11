<?php

namespace App\Controller;

use Symfony\Component\Serializer\SerializerInterface;

abstract class AbstractController
{
    /** @var SerializerInterface */
    protected $serializer;

    public function __construct(SerializerInterface $serializer)
    {
        $this->serializer = $serializer;
    }
}